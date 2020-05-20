const { getNewPicture } = require("./getNewPicture");
const { handlePicture } = require("./helperFunctions")
const {electron, ipcMain, BrowserWindow} = require('electron');
const { menubar } = require('menubar');
const fs = require('fs')
const NodePath = require('path')
const Config = require('electron-config')

const mb = menubar({
    index: `file://${NodePath.resolve(__dirname, 'static', 'index.html')}`,
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
let provider = config.get('provider') || 'unsplash'
let timerInterval = config.get('timer') || 60
let timer;
let stopped = config.get('stopped')

let willGetPhotoOnLaunch = config.get('willGetPhotoOnLaunch') == false ? false : true;

mb.on('ready', () => {
    mb.showWindow()
    console.log('\x1b[36m[START]\x1b[0m Window ready')
    if (!stopped && willGetPhotoOnLaunch) {
        reloadPicture()
        timer = setInterval(reloadPicture, timerInterval * 1000)
    } else {
        console.log('\x1b[32m[INFO]\x1b[0m Window is still stopped from last session or frozen from settings')
        global.attribution = config.get('attribution')
        mb.window.once('show', () => {
            console.log('\x1b[32m[INFO]\x1b[0m Window finished loading')
            mb.window.webContents.send('ready')
        })
    }
})

mb.app.on('quit', () => {
    config.set('attribution', global.attribution)
})

ipcMain.on('skip', () => {
    console.log('\x1b[32m[INFO]\x1b[0m Skipping image')
    clearInterval(timer)
    reloadPicture()
    if (!stopped) {
        timer = setInterval(reloadPicture, timerInterval * 1000)
    }
})

ipcMain.on('stop', () => {
    stopped = !stopped
    config.set('stopped', stopped)
    console.log('\x1b[32m[INFO]\x1b[0m Stop status: ', config.get('stopped'))
    if (stopped) {
        clearInterval(timer)
    } else {
        timer = setInterval(reloadPicture, timerInterval * 1000)
    }
})

ipcMain.on('quit', () => [
    mb.app.quit()
])

ipcMain.on('about', () => {
    let aboutWindow = new BrowserWindow({
        height: 300,
        width: 500,
        webPreferences: {
            nodeIntegration: true
        }
    })
    aboutWindow.loadFile(NodePath.resolve(__dirname, 'static', 'about.html'))
    aboutWindow.setMenu(null)
})

ipcMain.on('setInterval', (e, data) => {
    const newTimer = data.time
    if (data.time != config.get('timer')) {
        config.set('timer', newTimer)
        timerInterval = newTimer
        clearInterval(timer)
        if (!stopped && data.time) {
            timer = setInterval(reloadPicture, timerInterval * 1000)
        }
        console.log('\x1b[32m[INFO]\x1b[0m Interval set to', config.get('timer'), 'seconds')
    }
})

ipcMain.on('settings', () => {
    let settingsWindow = new BrowserWindow({
        height: 350,
        width: 520,
        webPreferences: {
            nodeIntegration: true
        }
    })
    settingsWindow.loadFile(NodePath.resolve(__dirname, 'static', 'settings', 'settings.html'))
    settingsWindow.setMenu(null)
})

ipcMain.on('updateProvider', (e, data) => {
    if (data.newProvider != config.get('provider')) {
        provider = data.newProvider
        config.set('provider', data.newProvider)
        reloadPicture()
    }
})

function reloadPicture() {
    console.log('\x1b[32m[INFO]\x1b[0m Reloading Image')
    getNewPicture(provider)
    .then((data) => {
        handlePicture(data)
            .then(() => mb.window.webContents.send('ready'))
    })
}




