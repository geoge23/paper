const axios = require('axios');
const fs = require('fs');
const PathNode = require('path');
const { handleAttribution, getUrlFromPath } = require("./helperFunctions");

async function getNewPicture(provider) {
    let path = PathNode.format({
        dir: global.appPath,
        base: `${provider}.json`
    });
    let info = JSON.parse(fs.readFileSync(path));
    const image = await axios({
        method: 'get',
        url: info.url,
        headers: {
            "Authorization": info.auth
        },
        params: info.parameters,
        responseType: info["requires-download"] ? 'json' : 'arraybuffer' //makes sure json endpoints respond with readable objects rather than binary
    });
    if (info["can-get-attributions"]) {
        handleAttribution(image.data, info);
    } else {
        global.attribution = {
            source: info["name"]
        }
    }
    if (info["requires-download"]) {
        const imageFile = await axios({
            method: 'get',
            url: getUrlFromPath(image.data, info),
            headers: {
                "Content-Type": "image/jpeg",
            },
            responseType: 'arraybuffer'
        });
        return imageFile.data;
    }
    else {
        return image.data;
    }
}
exports.getNewPicture = getNewPicture;
