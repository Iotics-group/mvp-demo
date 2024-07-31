'use strict'

import { app, protocol, BrowserWindow, ipcMain, globalShortcut, Menu, nativeImage, Tray } from 'electron'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
import installExtension, { VUEJS3_DEVTOOLS } from 'electron-devtools-installer'
import { eventController } from './main/events/eventController'
import { startMiddleware } from './main/connection/loop'
import createSuperAdmin from './main/utils/createsuperadmin'
import eventNames from './universal/eventNames'
import locale from '@/renderer/locale/index.json'
const path = require("path")

const { autoUpdater } = require('electron-updater')
const mongodb = require("./main/utils/connection")

const isDevelopment = process.env.NODE_ENV !== 'production'
app.commandLine.appendSwitch("disable-http-cache");

let mainWindow
const gotTheLock = app.requestSingleInstanceLock();

autoUpdater.autoDownload = false

let tray = null
app.whenReady().then(() => {
  const icon = nativeImage.createFromPath(path.join(__dirname, '..', 'build', 'icons', 'icon.ico'))
  tray = new Tray((icon))
  tray.on('click', () => {
    if (mainWindow.isVisible()) {
      if (mainWindow.isMinimized()) {
        mainWindow.restore();
      } else {
        mainWindow.minimize();
      }
    } else {
      mainWindow.show();
    }
  })
  tray.setToolTip('Iotics')
})
app.on('second-instance', (event, commandLine, workingDirectory) => {
  // When a second instance is launched, focus the first instance's window.
  if (mainWindow) {
    mainWindow.show()
    mainWindow.focus();
  }
});
ipcMain.on('show-context-menu', (event, message, lang) => {
  const template = [
    {
      label: locale['addFolder'][lang],
      enabled: (message != 'meter'),
      click: () => { event.sender.send('context-menu-add-file') }
    },
    // {
    //   label: 'Добавить USPD',
    //   click: () => { event.sender.send('context-menu-add-uspd') }
    // },
    {
      label: locale['addingMeter'][lang],
      enabled: (message != 'meter'),
      click: () => { event.sender.send('context-menu-add-counter') }
    },
    {
      label: locale['rename'][lang],
      // enabled: false,
      enabled: (message != 'meter'),
      click: () => { event.sender.send('context-menu-rename-file') }
    },
    {
      label: locale['remove'][lang],
      // enabled: false,
      click: () => { event.sender.send('context-menu-remove') }
    },
  ]
  const menu = Menu.buildFromTemplate(template)
  menu.popup({ window: BrowserWindow.fromWebContents(event.sender) })
})
ipcMain.on('show-context-menu2', (event, message, lang) => {
  const template = [
    {
      label: locale['edit'][lang],
      // enabled: false,
      enabled: (message == 'meter'),
      click: () => { event.sender.send('context-menu-edit-counter') }
    },
    {
      label: locale['remove'][lang],
      // enabled: false,
      click: () => { event.sender.send('context-menu-remove') }
    },
  ]
  const menu = Menu.buildFromTemplate(template)
  menu.popup({ window: BrowserWindow.fromWebContents(event.sender) })
})
ipcMain.on('show-context-emodel', (event, message, lang) => {
  const template = [
    {
      label: locale['edit'][lang],
      enabled: (message == 'meter'),
      click: () => { event.sender.send('context-menu-edit') }
    },
    {
      label: locale['newObject'][lang],
      enabled: ((message != 'meter') && (message != 'end')),
      click: () => { event.sender.send('context-menu-add-obj') }
    },
    {
      label: locale['rename'][lang],
      enabled: (message != 'meter'),
      click: () => { event.sender.send('context-menu-edit') }
    },
    {
      label: locale['remove'][lang],
      click: () => { event.sender.send('context-menu-delete') }
    },
  ]
  const menu = Menu.buildFromTemplate(template)
  menu.popup({ window: BrowserWindow.fromWebContents(event.sender) })
})

export const sendMessage = async ({ id, status, where }) => {
  mainWindow.webContents.send(eventNames.send_message, { id: String(id), status, where });
}

const eventSocket = (date, event, meter_name, meter_id, _id) => {
  console.log(date, event, meter_name, meter_id, _id)
  mainWindow.webContents.send(eventNames.event, { date, event, meter_name, meter_id, _id });
};

const manualRequestSocket = (status, where) => {
  console.log(status, where)
  mainWindow.webContents.send(eventNames.manualRequest, { status, where });
};

if (!gotTheLock) {
  app.quit()
} else {
  protocol.registerSchemesAsPrivileged([
    { scheme: 'app', privileges: { secure: true, standard: true } }
  ])

  app.on('ready', async () => {

    if (isDevelopment && !process.env.IS_TEST) {
      // Install Vue Devtools
      try {
        await installExtension(VUEJS3_DEVTOOLS)
      } catch (e) {
        console.error('Vue Devtools failed to install:', e.toString())
      }
    }
    if (!isDevelopment) launchAtStartup();

    eventController(ipcMain)
    await createWindow()
    await mongodb()
      .then(async () => {
        await createSuperAdmin()
        // await startMiddleware(eventSocket, manualRequestSocket)
      })

    // mainWindow.hide()
    mainWindow.on('close', (event) => {
      event.preventDefault(); // Prevent the window from closing
      mainWindow.hide();  // hide window
    });
  })
}

async function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1920,
    height: 1080,
    x: 0, y: 0,
    titleBarStyle: 'hidden',
    title: 'Iotics',
    enableLargerThanScreen: true,
    allowRunningInsecureContent: true,
    icon: nativeImage.createFromPath(path.join(__dirname, '..', 'build', 'icons', 'icon.ico')),
    // 'skip-taskbar': true,
    // alwaysOnTop: true,
    // hasShadow: false,
    fullscreen: true,
    autoHideMenuBar: true,
    webPreferences: {
      enableRemoteModule: true,
      // Use pluginOptions.nodeIntegration, leave this alone
      // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
      nodeIntegration: true,
      allowRunningInsecureContent: false, // false
      contextIsolation: false,
      session: true,
      webSecurity: false
    }
  })

  mainWindow.webContents.loadURL(__dirname, { "extraHeaders": "pragma: no-cache\n" })
  mainWindow.setMenu(null)
  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    await mainWindow.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
    if (!process.env.IS_TEST) mainWindow.webContents.openDevTools()

  } else {
    createProtocol('app')
    // Load the index.html when not in development
    mainWindow.loadURL('app://./index.html')
  }
}

function launchAtStartup() {
  app.setLoginItemSettings({
    openAtLogin: true,
    //  openAsHidden: true
  });
}

ipcMain.on('minimize', () => {
  BrowserWindow.getFocusedWindow().minimize()
})
ipcMain.on('close', () => {
  mainWindow.close()
})
ipcMain.on('reload', () => {
  mainWindow.reload()
})


autoUpdater.on("update-available", () => {
  if (mainWindow) {
    mainWindow.webContents.send('update-available', 'update is available, do you want to update');
  }
  ipcMain.on('update', (args) => {
    if (args.update) {
      autoUpdater.downloadUpdate()
    } else {
      console.log("nothing happened")
    }
  })
}
)

app.on('browser-window-focus', function () {
  globalShortcut.register("Control+Alt+B+M", () => {
    mainWindow.webContents.openDevTools()
  });
});

app.on('browser-window-blur', function () {
  globalShortcut.unregister('CommandOrControl+R');
  globalShortcut.unregister('F5');
  globalShortcut.unregister('Control+Shift+R');
  globalShortcut.unregister('Control+Shift+I');
  globalShortcut.unregister('F12');
});



if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', (data) => {
      if (data === 'graceful-exit') {
        app.quit()
      }
    })
  } else {
    process.on('SIGTERM', () => {
      app.quit()
    })
  }
}
