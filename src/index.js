const getColors = require("get-image-colors");
const GoogleImages = require("google-images");
const got = require("got");

class GetStringColors {
    constructor(googleCseId, googleApiKey) {
        this.googleImages = new GoogleImages(googleCseId, googleApiKey);
    }

    requestJpgImageUrls (query, options={}) {
        options = Object.assign({size: "medium"}, options);
        this.googleImages.search(query, options)
            .then(images => {
                /*
                [{
                    "url": "http://steveangello.com/boss.jpg",
                    "type": "image/jpeg",
                    "width": 1024,
                    "height": 768,
                    "size": 102451,
                    "thumbnail": {
                        "url": "http://steveangello.com/thumbnail.jpg",
                        "width": 512,
                        "height": 512
                    }
                }]
                */
                return images[0].url;
            });
    }

    requestImageAsBuffer (url) {
        got(url)
            .then(response => {
                return response.body;
            })
            .catch(error => {
                throw {name: error.response.body, message: `Failed requesting ${url} to buffer`};
            });
    }

    getColorsFromJpgBuffer (buffer) {
        return getColors(buffer, "image/jpg");
    }

    getStringColors (query) {
        new Promise((resolve, reject) => {
            // Get jpg image urls matching string
            const imageUrls = this.requestJpgImageUrls(query);
            // Download first image image into buffer
            const buffer = this.requestImageUrlAsBuffer(imageUrls[0]);
            // Get colors from image buffer
            const colors = this.getColorsFromJpgBuffer(buffer);
            // Return colors to fulfil promise
            resolve(colors);
            reject();
            throw {name: "getStringColorsError", message: "General error"};
        });
    }
}

module.exports = GetStringColors;