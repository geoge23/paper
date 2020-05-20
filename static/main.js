const { ipcRenderer, remote } = require('electron');
const Config = require('electron-config')
const path = require('path')
const fs = require('fs')
const workName = document.getElementById('workName')
const workArtist = document.getElementById('workArtist')
const workViewing = document.getElementById('workViewing')
const stop = document.getElementById('stop')
const skip = document.getElementById('skip')
const image = document.getElementById('image')
const loading = document.getElementsByClassName('loading')[0]

const config = new Config()
let isStopped = config.get('stopped') || false;

stop.addEventListener('click', () => {
    ipcRenderer.send('stop')
    isStopped = !isStopped
    stop.style.filter = isStopped ? "invert(30%) sepia(78%) saturate(7182%) hue-rotate(353deg) brightness(92%) contrast(127%)" : ""
})
skip.addEventListener('click', () => {
    ipcRenderer.send('skip')
    loading.style.visibility = "visible";
})

ipcRenderer.on('ready', (data) => {
    console.log('%c[INFO]' + ' %cRenderer ready', "color: green;", "color: white;")
    loadAttribution()
    //gets image as base664 from node to avoid chrome local resource blocking
    let src = path.resolve(remote.getGlobal('appPath'), 'pic.jpg')
    let imgBase64 = fs.readFileSync(src, { encoding: 'base64' })
    image.src = `data:image/jpg;base64, ${imgBase64}`
    stop.style.filter = isStopped ? "invert(30%) sepia(78%) saturate(7182%) hue-rotate(353deg) brightness(92%) contrast(127%)" : "";
    loading.style.visibility = "hidden";
})

function loadAttribution() {
    let data = remote.getGlobal('attribution');
    console.log('%c[INFO]' + ' %cAttribution '+ data +' loaded', "color: green;", "color: white;")
    console.log(data)
    if (typeof data.title !== 'undefined' && data.title) {
        workName.innerText = data.title;
    } else {
        workName.innerText = "A photo "
        workViewing.hidden = "true"
    }
    workArtist.innerText = data.artist ? `by ${data.artist} from ${data.source}` : `from ${data.source}`
}