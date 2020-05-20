const wallpaper = require('wallpaper');
const NodePath = require('path')
const fs = require('fs')

function getUrlFromPath(image, info) {
    let path;
    if (info["response-path"]) {
        for (i = 0; i < info["response-path"].length; i++) {
            let pathSection = info["response-path"][i]
            path = path ? path[pathSection] : image[pathSection]
        }
        return path;
    } else {
        return image;
    }
}
exports.getUrlFromPath = getUrlFromPath;

function handleAttribution(image, info) {
    let path;
    for (i = 0; i < info["attribution-path"].length; i++) {
        let pathSection = info["attribution-path"][i]
        path = path ? path[pathSection] : image[pathSection]
    }
    if (info['allows-name']) {
        
    }
    global.attribution = {
        name: info['allows-name'] ? name : undefined,
        artist: path,
        source: info['name']
    }
}
exports.handleAttribution = handleAttribution;

function handlePicture(data) {
    return new Promise((resolve, reject) => {
        let file = NodePath.resolve(global.appPath, "pic.jpg")
        fs.writeFileSync(file, data)
        wallpaper.set(file)
            .catch(e => reject(e))
            .then(() => resolve())
    })
}
exports.handlePicture = handlePicture