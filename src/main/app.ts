import { app, BrowserWindow, screen, ipcMain } from 'electron';

import './credential';
import Commands from '../commands';
import { Cluster } from './cluster';

declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

if (require('electron-squirrel-startup')) {
  app.quit();
}

let mainWindow: BrowserWindow;

function onReady(): void {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;
  mainWindow = new BrowserWindow({
    title: 'Mongo Explorer',
    width: width >= 1980 ? 1980 : width,
    height: height >= 1080 ? 1080 : height,
    backgroundColor: '#121417',
    titleBarStyle: 'hidden',
    trafficLightPosition: {
      x: 17,
      y: 10
    },
    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY
    }
  });

  if (app.isPackaged) {
    mainWindow.removeMenu();
  }
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);
}

function onAllWindowsClosed() {
  if (process.platform !== 'darwin') {
    app.quit();
  }
}

function onActivate() {
  if (BrowserWindow.getAllWindows().length === 0) {
    onReady();
  }
}

function onQuit() {
  Cluster.disconnectAllClusters();
}

app.on('ready', onReady);
app.on('window-all-closed', onAllWindowsClosed);
app.on('activate', onActivate);
app.on('quit', onQuit);

ipcMain.handle(Commands.CloseWindow, () => mainWindow?.close());
ipcMain.handle(Commands.MinimizeWindow, () => mainWindow?.minimize());
