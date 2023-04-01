const {app, BrowserWindow} = require('electron')

function createWindow() {
    const window = new BrowserWindow({
        width: 800,
        height: 600,
        frame: false,
        transparent: false,
        alwaysOnTop: true,
        webPreferences: {
            nodeIntegration: true
        }
    })

    window.loadFile('index.html')
    window.setIgnoreMouseEvents(true)
    window.setVisibleOnAllWorkspaces(true)
    window.setOpacity(0.5)

    return window
}

app.whenReady().then(() => {
    createWindow();
});