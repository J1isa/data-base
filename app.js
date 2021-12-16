const { app, BrowserWindow } = require("electron")
const windowStateKeeper = require('electron-window-state');
const { NODE_ENV = 'development' } = process.env
const isDevMode = NODE_ENV != 'production'

app.once('ready', () => {
  const state = windowStateKeeper({
    defaultWidth: 800,
    defaultHeight: 600
  });

  const win = new BrowserWindow({
    ...state,
    show: true,
    webPreferences: {
      nodeIntegration: true, 
      contextIsolation: false,
      v8CacheOptions: false
    }
  })      

  state.manage(win)

  win.loadFile('index.html')
  if(isDevMode) win.webContents.openDevTools()
  win.once('close', () => process.exit())
})