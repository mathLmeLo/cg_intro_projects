const { app, BrowserWindow, globalShortcut } = require('electron')


const createWindow = () => {
  const win = new BrowserWindow({
    width: 600,
    height: 600,
    titleBarStyle: 'hidden',
    autoHideMenuBar: true,
    alwaysOnTop: true,
    webPreferences: {
      nodeIntegration: true
    }
  })

  win.loadFile('index.html')
}

function toggleDevTools() {
  win.webContents.toggleDevTools()
}

function createShortcuts() {
  globalShortcut.register('CmdOrCtrl+J', toggleDevTools)
  globalShortcut.register('f5', function() {
		console.log('f5 is pressed')
		win.reload()
	})
	globalShortcut.register('CommandOrControl+R', function() {
		console.log('CommandOrControl+R is pressed')
		win.reload()
	})
}

app.whenReady().then(() => {
  createWindow()
}).then(createShortcuts)

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})