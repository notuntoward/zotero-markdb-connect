import { config } from '../../package.json';
import { DataManager } from '../dataGlobals';
import { getParam } from './mdbcParam';
import { Logger } from './mdbcLogger';

export class ObsidianInteractions {
  private static async checkAdvancedUriPlugin(vaultPath: string): Promise<[boolean, boolean]> {
    const pluginId = 'obsidian-advanced-uri';
    const pluginsDir = `${vaultPath}/.obsidian/plugins`;
    const communityPluginsFile = `${vaultPath}/.obsidian/community-plugins.json`;

    const pluginDirExists = await Zotero.File.exists(`${pluginsDir}/${pluginId}`);
    if (!pluginDirExists) {
      return [false, false];
    }

    const communityPluginsFileExists = await Zotero.File.exists(communityPluginsFile);
    if (!communityPluginsFileExists) {
      return [true, false];
    }

    try {
      const enabledPlugins = JSON.parse(await Zotero.File.getContentsAsync(communityPluginsFile));
      const isEnabled = enabledPlugins.includes(pluginId);
      return [true, isEnabled];
    } catch (e) {
      Logger.log('checkAdvancedUriPlugin', `Error reading community plugins file: ${e}`, true, 'error');
      return [true, false];
    }
  }

  private static async openWithAdvancedUri(notePath: string, vaultName: string): Promise<void> {
    const encodedVaultName = encodeURIComponent(vaultName);
    const encodedNotePath = encodeURIComponent(notePath);
    const uri = `obsidian://adv-uri?vault=${encodedVaultName}&filepath=${encodedNotePath}&newpane=true`;
    Zotero.launchURL(uri);
  }

  private static async openWithRestApi(notePath: string, port: string, apiKey: string): Promise<void> {
    const url = `http://127.0.0.1:${port}/open-note`;
    const params = {
      file: notePath,
      key: apiKey,
    };
    const queryString = Object.entries(params)
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
      .join('&');

    try {
      const response = await Zotero.HTTP.request('GET', `${url}?${queryString}`);
      if (response.status !== 200) {
        throw new Error(`Obsidian API returned status ${response.status}`);
      }
    } catch (e) {
      Logger.log('openWithRestApi', `Error opening note with REST API: ${e}`, true, 'error');
      throw new Error('FAILED to open note with Obsidian REST API. Is Obsidian running and the API key correct?');
    }
  }

  private static openWithStandardUri(notePath: string, vaultName: string): void {
    const encodedVaultName = encodeURIComponent(vaultName);
    const encodedNotePath = encodeURIComponent(notePath);
    const uri = `obsidian://open?vault=${encodedVaultName}&file=${encodedNotePath}`;
    Zotero.launchURL(uri);
  }

  public static async openNoteForItems(items: Zotero.Item[]): Promise<void> {
    if (!items || items.length === 0) {
      throw new Error('No items selected.');
    }
    if (items.length > 1) {
      throw new Error('More than one item selected. Please select only one item to open its note.');
    }
    const item = items[0];
    const notes = DataManager.getNotesForItem(item.id);

    if (notes.length === 0) {
      throw new Error(`Note for item "${item.getField('title')}" not found.`);
    }

    const notePath = notes[0].path;
    const interactionMode = getParam.obsidianInteractionMode().value;
    const vaultPath = getParam.sourcedir().value;
    const vaultName = getParam.obsidianvaultname().value || vaultPath.split('/').pop().split('\\').pop();

    if (!vaultName) {
        throw new Error('Obsidian vault name is not configured.');
    }

    switch (interactionMode) {
      case 'advancedUri':
        const [isInstalled, isEnabled] = await this.checkAdvancedUriPlugin(vaultPath);
        if (isInstalled && isEnabled) {
          await this.openWithAdvancedUri(notePath, vaultName);
        } else {
          this.openWithStandardUri(notePath, vaultName);
        }
        break;
      case 'restApi':
        const port = getParam.obsidianRestApiPort().value;
        const apiKey = getParam.obsidianRestApiKey().value;
        await this.openWithRestApi(notePath, port, apiKey);
        break;
      case 'standard':
      default:
        this.openWithStandardUri(notePath, vaultName);
        break;
    }
  }
}
