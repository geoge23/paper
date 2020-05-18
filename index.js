const { getNewPicture } = require("./getNewPicture");
const NodePath = require('path')
const {electron, ipcMain} = require('electron');
const { menubar } = require('menubar');
const wallpaper = require('wallpaper');
const fs = require('fs')
const Config = require('electron-config')

const mb = menubar({
    index: `file://${__dirname}/static/index.html`,
    browserWindow: {
        width: 400,
        height: 200,
        webPreferences: {
            nodeIntegration: true
        }
    }
});
const app = mb.app
global.appPath = app.getPath('userData');
module.exports = {
    mb: mb,
    app: app,
    appPath: appPath
}

const config = new Config();

mb.on('ready', () => {
    mb.showWindow()
})

getNewPicture('dummy')
.then((data) => {
    mb.window.webContents.send('ready')
    let file = NodePath.resolve(appPath, "pic.jpg")
    fs.writeFileSync(file, data)
})



