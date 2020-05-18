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