import { config } from '../../package.json'
import { DataManager } from '../dataGlobals'
import { getString } from '../utils/locale'
import { setPref } from '../utils/prefs'

import { Elements } from './create-element'
import { getErrorMessage, Logger, trace } from './mdbcLogger'
import { getParam } from './mdbcParam'
import { ObsidianInteractions } from './mdbcObsidian'
import { patch as $patch$ } from './monkey-patch'

import type { Entry, notificationData, NotificationType, NotifyCreateLineOptions, ZoteroIconURI } from '../mdbcTypes'

const favIcon = `chrome://${config.addonRef}/content/icons/favicon.png` as const // TODO: move def and import form all modules

const additionalIcons = [favIcon, 'chrome://zotero/skin/toolbar-item-add@2x.png'] as const
type AddonIconURI = (typeof additionalIcons)[number]
type IconURI = AddonIconURI | ZoteroIconURI

export class Notifier {
  static readonly notificationTypes: Record<NotificationType, IconURI> = {
    addon: favIcon,
    success: 'chrome://zotero/skin/tick@2x.png',
    error: 'chrome://zotero/skin/error@2x.png', //'cross@2x.png',
    warn: 'chrome://zotero/skin/warning@2x.png',
    info: 'chrome://zotero/skin/prefs-advanced.png',
    debug: 'chrome://zotero/skin/treeitem-patent@2x.png',
    config: 'chrome://zotero/skin/prefs-general.png',
    itemsadded: 'chrome://zotero/skin/toolbar-item-add@2x.png',
    itemsremoved: 'chrome://zotero/skin/minus@2x.png',
    // xmark@2x.png
  }

  static notify(data: notificationData): void {
    const header = `${config.addonName} : ${data.title}`

    let messageArray: notificationData['messageArray'] = []
    try {
      if (!('messageArray' in data) || !Array.isArray(data.messageArray) || data.messageArray.length === 0) {
        if (!data.body || !data.type) return
        messageArray = [{ body: data.body, type: data.type }]
      } else {
        messageArray = data.messageArray
      }
    } catch (err) {
      Logger.log('Notifier', `ERROR: ${getErrorMessage(err)}`, false, 'error')
      return
    }

    const timeout = 5 // seconds
    const ms = 1000 // milliseconds
    const popupWin = new ztoolkit.ProgressWindow(header, {
      // window?: Window,
      closeOnClick: true,
      closeTime: timeout * ms,
      closeOtherProgressWindows: false,
    })

    for (const message of messageArray) {
      const type = message.type || 'addon'

      const lineOptions: NotifyCreateLineOptions = {
        text: message.body,
        icon: this.notificationTypes[type],
        progress: 100,
      }
      popupWin.createLine(lineOptions)
    }

    popupWin.show()
  }
}

export class systemInterface {
  static expandSelection(ids: 'selected' | number | number[]): number[] {
    if (Array.isArray(ids)) return ids

    if (ids === 'selected') {
      try {
        // return Zotero.getActiveZoteroPane().getSelectedItems(true)
        return ztoolkit.getGlobal('ZoteroPane').getSelectedItems(true)
      } catch (err) {
        // zoteroPane.getSelectedItems() doesn't test whether there's a selection and errors out if not
        Logger.log('expandSelection', `Could not get selected items: ${getErrorMessage(err)}`, false, 'warn')
        return []
      }
    }

    return [ids]
  }

  @trace
  static async dumpDebuggingLog() {
    const data = JSON.stringify(Logger.dump(), null, 1)
    const filename = `${config.addonName.replace('-', '')}-logs.json`

    const filepathstr = await new ztoolkit.FilePicker(
      `Save ${config.addonName} Debugging Logs`,
      'save',
      [
        ['JSON File(*.json)', '*.json'],
        ['Any', '*.*'],
      ],
      filename,
    ).open()

    if (!filepathstr) return

    Logger.log('saveDebuggingLog', `Saving to ${filepathstr}`, false, 'info')

    await Zotero.File.putContentsAsync(filepathstr, data)
  }

  @trace
  static async dumpJsonFile(data: string, title: string, filename: string) {
    if (!data) {
      Logger.log(
        'saveJsonFile',
        `ERROR No data to save. \n  filename :: ${filename} \n  title :: ${title} \n  data :: ${data}`,
        false,
        'error',
      )
    }

    const filepathstr = await new ztoolkit.FilePicker(
      title,
      'save',
      [
        ['JSON File(*.json)', '*.json'],
        ['Any', '*.*'],
      ],
      filename,
    ).open()

    if (!filepathstr) return

    Logger.log('saveJsonFile', `Saving to ${filepathstr}`, false, 'info')

    await Zotero.File.putContentsAsync(filepathstr, data)
  }

  @trace
  static showSelectedItemMarkdownInFilesystem(entry_res: Entry): void {
    try {
      const fileObj = Zotero.File.pathToFile(entry_res.path)
      fileObj.normalize()
      if (fileObj.isFile()) {
        try {
          fileObj.reveal()
          Logger.log('showSelectedItemMarkdownInFilesystem', `Revealing ${fileObj.path}`, false, 'info')
        } catch (err) {
          // On platforms that don't support nsIFileObj.reveal() (e.g. Linux), launch the parent directory
          Zotero.launchFile(fileObj.parent.path)
          Logger.log(
            'showSelectedItemMarkdownInFilesystem',
            `Reveal failed, falling back to opening parent directory of ${fileObj.path}`,
            false,
            'warn',
          )
        }
      }
    } catch (err) {
      Logger.log(
        'showSelectedItemMarkdownInFilesystem',
        `ERROR :: ${entry_res?.path} :: ${getErrorMessage(err)}`,
        false,
        'warn',
      )
    }
  }

}

export class UIHelpers {
  @trace
  static registerWindowMenuItem_Sync() {
    ztoolkit.Menu.register('menuTools', {
      tag: 'menuseparator',
    })
    // menu->Tools menuitem
    ztoolkit.Menu.register('menuTools', {
      tag: 'menuitem',
      id: `${config.addonRef}-tools-menu-sync`,
      label: getString('menuitem-sync'),
      oncommand: `Zotero.${config.addonInstance}.hooks.syncMarkDB();`,
    })
  }

    @trace
    static registerOpenNote() {
        ztoolkit.Menu.register('menuTools', {
            tag: 'menuitem',
            id: `${config.addonRef}-tools-menu-open-note`,
            label: getString('menuitem-open-note'),
            oncommand: `Zotero.${config.addonInstance}.hooks.openObsidianNote();`,
        });

        ztoolkit.Shortcuts.register('keydown', {
            id: `${config.addonRef}-shortcut-open-note`,
            key: 'O',
            modifiers: {
                ctrl: true,
            },
            oncommand: `Zotero.${config.addonInstance}.hooks.openObsidianNote();`,
        });
    }

  @trace
  static registerWindowMenuItem_Debug() {
    // menu->Tools menuitem
    ztoolkit.Menu.register('menuTools', {
      tag: 'menuitem',
      id: `${config.addonRef}-tools-menu-troubleshoot`,
      label: getString('menuitem-troubleshoot'),
      oncommand: `Zotero.${config.addonInstance}.hooks.syncMarkDBReport();`,
    })
  }

  static registerRightClickMenuItem() {
    $patch$(
      Zotero.getActiveZoteroPane(),
      'buildItemContextMenu',
      (original) =>
        async function ZoteroPane_buildItemContextMenu() {
          // @ts-ignore
          await original.apply(this, arguments)

          const doc = Zotero.getMainWindow().document

          const itemMenuOpenId = '__addonRef__-itemmenu-open-note'
          doc.getElementById(itemMenuOpenId)?.remove()

          const itemMenuSeparatorId = '__addonRef__-itemmenu-separator'
          doc.getElementById(itemMenuSeparatorId)?.remove()

          const selectedItems: Zotero.Item[] = this.getSelectedItems()

          if (!selectedItems || selectedItems.length === 0) return

          const notesForItems = selectedItems.some(item => DataManager.getNotesForItem(item.id).length > 0)
          if (!notesForItems) return;
          
          const itemmenu = doc.getElementById('zotero-itemmenu')
          if (!itemmenu) return

          const elements = new Elements(doc)

          itemmenu.appendChild(elements.create('menuseparator', { id: itemMenuSeparatorId }))

          itemmenu.appendChild(
            elements.create('menuitem', {
              id: itemMenuOpenId,
              label: getString('contextmenuitem-open-note'),
              oncommand: () => ObsidianInteractions.openNoteForItems(selectedItems),
            }),
          )
        },
    )
  }

  @trace
  static highlightTaggedRows() {
    /* Render primary cell
    _renderCell
    _renderPrimaryCell
    https://github.com/zotero/zotero/blob/32ba987c2892e2aee6046a82c08d69145e758afd/chrome/content/zotero/elements/colorPicker.js#L178
    https://github.com/windingwind/ZoteroStyle/blob/6b7c7c95abb7e5d75d0e1fbcc2d824c0c4e2e81a/src/events.ts#L263
    https://github.com/ZXLYX/ZoteroStyle/blob/57fa178a1a45e710a73706f0087892cf19c9caf1/src/events.ts#L286
     */
    const tagstrParam = getParam.tagstr()
    if (!tagstrParam.valid) return
    const tagstr = tagstrParam.value

    const spans: NodeListOf<HTMLSpanElement> = Zotero.getMainWindow().document.querySelectorAll(
      `span[aria-label*="Tag ${tagstr}."]`,
    )

    spans.forEach((span) => {
      span.style.color = 'red'
    })
  }
}

export class prefHelpers {
  @trace
  static async chooseVaultFolder() {
    const vaultpath = await new ztoolkit.FilePicker('Select Folder containing MD reading notes', 'folder').open()

    try {
      if (!vaultpath) throw new Error('No folder selected')

      const vaultpathObj = Zotero.File.pathToFile(vaultpath)
      vaultpathObj.normalize()

      if (
        vaultpath !== '' &&
        vaultpath !== undefined &&
        vaultpath != null &&
        vaultpathObj.exists() &&
        vaultpathObj.isDirectory()
      ) {
        setPref('sourcedir', vaultpath)
      }
    } catch (err) {
      Logger.log('chooseVaultFolder', `ERROR chooseVaultFolder :: ${getErrorMessage(err)}`, false, 'warn')
    }
  }

  static isValidRegExp(str: string): boolean {
    try {
      new RegExp(str)
      return true // No error means it's a valid RegExp
    } catch (err) {
      Logger.log('isValidRegExp', `ERROR: RegExp is not valid:: >> ${str} <<.`, false, 'warn')
      return false // An error indicates an invalid RegExp
    }
  }

  static checkMetadataFormat(metadatakeyword: string): boolean {
    if (typeof metadatakeyword === 'string' && metadatakeyword.length > 0) {
      const found: string[] = []
      const notallowed = [
        "'",
        '"',
        ':',
        '\n',
        '/',
        '\\',
        '?',
        '*',
        '|',
        '>',
        '<',
        ',',
        ';',
        '=',
        '`',
        '~',
        '!',
        '#',
        '$',
        '%',
        '^',
        '&',
        '(',
        ')',
        '[',
        ']',
        '{',
        '}',
        ' ',
      ]
      for (const char of notallowed) {
        if (metadatakeyword.includes(char)) {
          found.push(char)
        }
      }
      if (found.length > 0) {
        Logger.log('checkMetadataFormat', `ERROR: metadata id cannot contain: ${found.join(' or ')}.`, false, 'warn')
        return false
      } else {
        return true
      }
    } else {
      return true
    }
  }

  static checkTagStr(tagstr: string): boolean {
    if (typeof tagstr === 'string' && tagstr.length > 0) {
      const found: string[] = []
      const notallowed = [
        "'",
        '"',
        ':',
        '\n',
        '\\',
        '?',
        '*',
        '|',
        '>',
        '<',
        ',',
        ';',
        '=',
        '`',
        '~',
        '!',
        '$',
        '%',
        '^',
        '&',
        '(',
        ')',
        '[',
        ']',
        '{',
        '}',
        ' ',
      ]
      // '/',
      for (const char of notallowed) {
        if (tagstr.includes(char)) {
          found.push(char)
        }
      }
      if (found.length > 0) {
        Logger.log('checkTagStr', `ERROR: TagStr cannot contain: ${found.join(' or ')}.`, false, 'warn')
        return false
      } else {
        return true
      }
    } else {
      return true
    }
  }
}

export class Registrar {
  @trace
  static registerPrefs() {
    Zotero.PreferencePanes.register({
      pluginID: addon.data.config.addonID,
      src: rootURI + 'content/preferences.xhtml',
      label: getString('prefs-title'),
      image: `chrome://${addon.data.config.addonRef}/content/icons/favicon.png`,
    })
  }
}
