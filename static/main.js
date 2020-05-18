const { ipcRenderer, remote } = require('electron');
const path = require('path')
const workName = document.getElementById('workName')
const workArtist = document.getElementById('workArtist')
const workViewing = document.getElementById('workViewing')
const play = document.getElementById('play')
const stop = document.getElementById('stop')
const image = document.getElementById('image')

let isPlaying = true; //TODO add sync and save from main process
play.addEventListener('click', () => {
    const playIcon = play.getElementsByTagName('img')[0]
    isPlaying = !isPlaying;
    if (isPlaying) {
        playIcon.src = "./icons/play.svg"
    } else {
        playIcon.src = "./icons/pause.svg"
    }
})
stop.addEventListener('click', () => {
    
})

ipcRenderer.on('ready', (data) => {
    loadAttribution()
    let src = path.resolve(remote.getGlobal('appPath'), 'pic.jpg')
    image.src = `file://${src}`
})

function loadAttribution() {
    let data = remote.getGlobal('attribution');
    console.log(data)
    if (typeof data.title !== 'undefined' && data.title) {
        workName.innerText = data.title;
    } else {
        workName.innerText = "A photo "
        workViewing.hidden = "true"
    }
    workArtist.innerText = data.artist ? `by ${data.artist}` : '' + ` from ${data.source}`
}