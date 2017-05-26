let getColors = require("get-image-colors");
let GoogleImages = require("google-images");
let got = require("got");

let debug = require("debug")("get-string-colors");

// Thrown if get-string-colors cannot work out a good answer
function DataError(message){
    this.name = "DataError";
    this.message = message;
}
DataError.prototype = new Error();

// Module functions
let filterResultsByImageType = (results, type) => {
    debug("Filtering %d image results by type: %s", [results, type]);
    return results.filter(image => {
        return image.type === type;
    });
};

let processResultsToUrl = (results, type) => {
    debug("Picking one %s image URL from %d results", [type, results.length]);
    var filteredResults = filterResultsByImageType(results, type);
    try {
        var imageUrl = filteredResults[0].url;
    } catch (error) {
        throw new DataError("No suitable images were found for this query");
    }
    return imageUrl;
};


// Async functions (return promises from external deps)
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
                reject(error);
            });
    });
};

let getColorsFromBuffer = (buffer, type) => {
    debug("Getting colors from buffer type: %s", type);
    return getColors(buffer, type);
};


// Factory function: returns an async function (promised result)
let GetStringColors = (googleCseId, googleApiKey) => {
    debug("Manufacturing a new GetStringColors instance");
    let googleImages = new GoogleImages(googleCseId, googleApiKey);

    return (query, type="image/jpeg") => {
        debug("Getting string colors");
        return requestImageSearch(googleImages, query)
            .then(imageSearchResults => {
                return processResultsToUrl(imageSearchResults, type);
            })
            .then(imageUrl => {
                return requestImageUrlAsBuffer(imageUrl);
            })
            .then(buffer => {
                return getColorsFromBuffer(buffer, type);
            });
    };
};

module.exports = GetStringColors;
