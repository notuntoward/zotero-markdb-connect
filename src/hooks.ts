// import { config } from '../package.json'

import { DataManager } from './dataGlobals'
import { Elements } from './modules/create-element'
import { Logger } from './modules/mdbcLogger'
import { ObsidianInteractions } from './modules/mdbcObsidian'
import { ScanMarkdownFiles } from './modules/mdbcScan'
import { wrappers } from './modules/mdbcStartupHelpers'
import { Notifier, prefHelpers, Registrar, systemInterface, UIHelpers } from './modules/mdbcUX'
import { unpatch as $unpatch$ } from './modules/monkey-patch'
import { registerPrefsScripts } from './modules/preferenceScript'
import { getString, initLocale } from './utils/locale'
import { createZToolkit } from './utils/ztoolkit'

async function onStartup() {
  await Promise.all([Zotero.initializationPromise, Zotero.unlockPromise, Zotero.uiReadyPromise])

  initLocale()

  await wrappers.startupVersionCheck()

  Registrar.registerPrefs()

  await Promise.all(Zotero.getMainWindows().map((win) => onMainWindowLoad(win)))
}

async function onMainWindowLoad(win: _ZoteroTypes.MainWindow): Promise<void> {
  // Create ztoolkit for every window
  addon.data.ztoolkit = createZToolkit()

  const popupWin = new ztoolkit.ProgressWindow(addon.data.config.addonName, {
    closeOnClick: true,
    closeTime: -1,
  })
    .createLine({
      text: getString('startup-begin'),
      icon: Notifier.notificationTypes.addon,
      type: 'default',
      progress: 0,
    })
    .show()

  popupWin.changeLine({
    progress: 30,
    text: `[30%]  ${getString('startup-syncing')}`,
  })

  await ScanMarkdownFiles.syncWrapper(false, false)

  popupWin.changeLine({
    progress: 80,
    text: `[80%]  ${getString('startup-finish')}`,
  })

  UIHelpers.registerWindowMenuItem_Sync()
  UIHelpers.registerOpenNote()

  if (!DataManager.isClean() || DataManager.numberRecords() === 0 || addon.data.env === 'development') {
    UIHelpers.registerWindowMenuItem_Debug()
  }

  UIHelpers.registerRightClickMenuItem()

  popupWin.changeLine({
    progress: 100,
    text: `[100%] ${getString('startup-finish')}`,
  })

  if (Logger.mode() !== 'minimal' || addon.data.env === 'development') {
    popupWin.addLines(`DebugMode: ${Logger.mode()}`, Notifier.notificationTypes.debug)
  }

  if (addon.data.env === 'development') {
    popupWin.addLines(`ENV: ${addon.data.env}`, Notifier.notificationTypes.debug)
  }

  popupWin.startCloseTimer(3000)
}

function syncMarkDB() {
  //// called from tools menu ////
  const displayReport = false
  const saveLogsToggle = false

  ScanMarkdownFiles.syncWrapper(displayReport, saveLogsToggle)
    .then(() => {
      Logger.log('syncMarkDB', 'finished', true, 'info')
    })
    .catch((err) => {
      Logger.log('syncMarkDB', `ERROR :: ${err}`, true, 'error')
    })
}

function openObsidianNote() {
  ObsidianInteractions.openNoteForItems(Zotero.getActiveZoteroPane().getSelectedItems()).catch((err) => {
    Logger.log('openObsidianNote', `ERROR :: ${err}`, true, 'error')
    let alertMessage = 'An unexpected error occurred while trying to open the Obsidian note.'
    if (err instanceof Error) {
      alertMessage = err.message
    } else if (typeof err === 'string') {
      if (err.includes('Note for item') && err.includes('not found')) {
        alertMessage = err
      } else if (err.includes('No items selected')) {
        alertMessage = 'Please select an item in Zotero first.'
      } else if (err.includes('More than one item selected')) {
        alertMessage = 'Please select only one item to open its note.'
      } else if (err.includes('FAILED')) {
        alertMessage = 'Could not connect to Obsidian. Please make sure Obsidian is running and the addon preferences are configured correctly.'
      } else {
        alertMessage = `An error occurred: ${err}`
      }
    }
    Zotero.alert(Zotero.getMainWindow(), 'MarkDB-Connect', alertMessage)
  })
}

function syncMarkDBReport() {
  //// called from tools menu ////
  const displayReport = true
  const saveLogsToggle = false

  ScanMarkdownFiles.syncWrapper(displayReport, saveLogsToggle)
    .then(() => {
      Logger.log('syncMarkDBReport', 'finished', true, 'info')
    })
    .catch((err) => {
      Logger.log('syncMarkDBReport', `ERROR :: ${err}`, true, 'error')
    })
}

function syncMarkDBSaveDebug() {
  //// called from prefs ////
  const displayReport = false
  const saveLogsToggle = true

  ScanMarkdownFiles.syncWrapper(displayReport, saveLogsToggle)
    .then(() => {
      Logger.log('syncMarkDBSaveDebug', 'finished', true, 'info')
    })
    .catch((err) => {
      Logger.log('syncMarkDBSaveDebug', `ERROR :: ${err}`, true, 'error')
    })
}

function saveLogs() {
  systemInterface
    .dumpDebuggingLog()
    .then(() => {
      Logger.log('saveDebuggingLog', 'finished', true, 'info')
    })
    .catch((err) => {
      Logger.log('saveDebuggingLog', `ERROR :: ${err}`, true, 'error')
    })
}

function saveJsonFile(data: string, title: string, filename: string) {
  systemInterface
    .dumpJsonFile(data, title, filename)
    .then(() => {
      Logger.log('dumpJsonFile', 'finished', true, 'info')
    })
    .catch((err) => {
      Logger.log('dumpJsonFile', `ERROR :: ${err}`, true, 'error')
    })
}

function Data() {
  return DataManager.data()
}
function DataZotIds() {
  return DataManager.zotIds()
}
function DataStore() {
  return DataManager.dump()
}
function Logs() {
  return Logger.dump()
}

async function onMainWindowUnload(win: Window): Promise<void> {
  Elements.removeAll()
  $unpatch$()
  ztoolkit.unregisterAll()
  addon.data.dialog?.window?.close()
}

function onShutdown(): void {
  ztoolkit.unregisterAll()
  addon.data.dialog?.window?.close()
  // Remove addon object
  addon.data.alive = false
  // @ts-ignore - Plugin instance is not typed
  delete Zotero[addon.data.config.addonInstance]
}

async function onPrefsEvent(type: string, data: Record<string, any>) {
  switch (type) {
    case 'load':
      registerPrefsScripts(data.window)
      break
    case 'chooseVaultFolder':
      await prefHelpers.chooseVaultFolder()
      break
    case 'checkMetadataFormat':
      prefHelpers.checkMetadataFormat(data.value as string)
      break
    case 'checkRegExpValid':
      prefHelpers.isValidRegExp(data.value as string)
      break
    case 'checkTagStr':
      prefHelpers.checkTagStr(data.value as string)
      break
    case 'syncMarkDBSaveDebug':
      syncMarkDBSaveDebug()
      break
    default:
      break
  }
}

export default {
  onStartup,
  onShutdown,
  onMainWindowLoad,
  onMainWindowUnload,
  onPrefsEvent,
  syncMarkDB,
  syncMarkDBReport,
  syncMarkDBSaveDebug,
  openObsidianNote,
  Logs,
  DataStore,
  Data,
  DataZotIds,
  saveLogs,
  saveJsonFile,
}
