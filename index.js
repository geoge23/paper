const electron = require('electron');
const wallpaper = require('wallpaper');
const {menubar, ipcRenderer} = require('menubar');

const mb = menubar({
    index: `file://${__dirname}/static/index.html`,
    browserWindow: {
        width: 400,
        height: 200
    }
});

mb.on('ready', () => {
    console.log('test')
})

