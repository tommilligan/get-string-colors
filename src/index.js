let getColors = require("get-image-colors");
let GoogleImages = require("google-images");
let got = require("got");

let debug = require("debug")("get-string-colors");

// Sync functions
let filterResultsByImageType = (results, type) => {
    debug("Filtering %d image results by type: %s", [results, type]);
    return results.filter(image => {
        return image.type === type;
    });
};

// Async functions (return promises)
let requestImageSearch = (googleImages, query, options={}) => {
    debug("Searching images for: %s", query);
    options = Object.assign({size: "medium"}, options);
    debug("Search options: %o", options);
    return googleImages.search(query, options);
};

let requestImageUrlAsBuffer = (url) => {
    debug("Requesting image URL %s as buffer", url);
    return new Promise((resolve, reject) => {
        got(url, {encoding: null})
            .then(response => {
                resolve(response.body);
            })
            .catch(error => {
                reject({name: error.response.body, message: `Failed requesting ${url} to buffer, ${error.response.body}`});
            });
    });
};

let getColorsFromBuffer = (buffer, type) => {
    debug("Getting colors from buffer type: %s", type);
    getColors(buffer, "image/jpeg");
};

// Factory function: returns an async function (promised result)
let GetStringColors = (googleCseId, googleApiKey) => {
    debug("Manufacturing a new GetStringColors instance");
    let googleImages = new GoogleImages(googleCseId, googleApiKey);

    return (query, type="image/jpeg") => {
        debug("Getting string colors");
        return requestImageSearch(googleImages, query)
            .then(imageSearchResults => {
                return filterResultsByImageType(imageSearchResults, type);
            })
            .then(filteredResults => {
                let imageUrl = filteredResults[0].url;
                return requestImageUrlAsBuffer(imageUrl);
            })
            .then(buffer => {
                return getColorsFromBuffer(buffer, type);
            });
    };
};

module.exports = GetStringColors;