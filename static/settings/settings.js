//node imports
const remote = require('electron').remote;
const fs = require('fs')
const path = require('path')
const Config = require('electron-config')
const config = new Config()
const ipcRenderer = require('electron').ipcRenderer
const AutoLaunch = require('auto-launch')
//dom variables
const providerList = document.getElementById('provider')
const save = document.getElementsByTagName('button')[0]
const willGetPhotoOnLaunch = document.getElementById('willGetPhotoOnLaunch')
const willLaunchOnStartup = document.getElementById('willLaunchOnStartup')
const timerInterval = document.getElementById('timerInterval')

//loads settings from config
willGetPhotoOnLaunch.checked = config.get('willGetPhotoOnLaunch') != undefined ? config.get('willGetPhotoOnLaunch') : true
willLaunchOnStartup.checked = config.get('willLaunchOnStartup') != undefined ? config.get('willLaunchOnStartup') : false
timerInterval.value = config.get('timer') || 60

//loads files from providers and displays them as options
let providersFile = path.resolve(remote.getGlobal('appPath'), 'providers')
let providers = fs.readdirSync(providersFile)
let currentProvider = config.get('provider')
let currentProviderDom;
providers.forEach((provider, index) => {
    let name = path.parse(provider).name; //gets name and removes json extension
    providerList.innerHTML += name == currentProvider ? `<option value="${name}" selected="selected">${name}</option>` : `<option value="${name}">${name}</option>`
})

//controls application auto launch
const launcherOnStartup = new AutoLaunch({
    name: 'Paper'
})

//final save logic
save.addEventListener('click', (e) => {
    e.preventDefault()
    ipcRenderer.send('updateProvider', {newProvider: providerList.value})
    ipcRenderer.send('setInterval', {time: timerInterval.value})
    config.set('willGetPhotoOnLaunch', willGetPhotoOnLaunch.checked)
    if (willLaunchOnStartup.checked) {
        launcherOnStartup.enable()
        config.set('willLaunchOnStartup', true)
    } else {
        launcherOnStartup.disable()
        config.set('willLaunchOnStartup', false)
    }
})