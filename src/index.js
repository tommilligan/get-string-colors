const getColors = require("get-image-colors");
const GoogleImages = require("google-images");
const got = require("got");

const debug = require("debug")("get-string-colors");

class GetStringColors {
    constructor(googleCseId, googleApiKey) {
        debug("Constructing a new GetStringColors instance");
        this.googleImages = new GoogleImages(googleCseId, googleApiKey);
    }

    requestJpgImageUrls (query, options={}) {
        debug("Requesting JPEG image URLs for: %s", query);
        options = Object.assign({size: "medium"}, options);
        debug("Request options: %o", options);
        return new Promise((resolve) => {
            const search = this.googleImages.search(query, options);
            search.then(images => {
                debug("Image results: %d", images.length);
                const jpgImages = images.filter(image => {
                    return image.type === "image/jpeg";
                });
                debug("JPEG image results: %d", jpgImages.length);
                resolve(jpgImages.map(image => image.url));
            });
        });
    }

    requestImageAsBuffer (url) {
        debug("Requesting image URLs as buffer");
        return new Promise((resolve, reject) => {
            got(url)
                .then(response => {
                    resolve(response.body);
                })
                .catch(error => {
                    reject({name: error.response.body, message: `Failed requesting ${url} to buffer`});
                });
        });
    }

    getColorsFromJpgBuffer (buffer) {
        debug("Getting colors from JPEG buffer");
        return getColors(buffer, "image/jpg");
    }

    getStringColors (query) {
        debug("Getting string colors");
        return this.requestJpgImageUrls(query)
            .then(imageUrls => {
                return this.requestImageUrlAsBuffer(imageUrls[0]);
            }).then(buffer => {
                return this.getColorsFromJpgBuffer(buffer);
            });
    }
}

module.exports = GetStringColors;