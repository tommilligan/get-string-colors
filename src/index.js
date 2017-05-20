const getColors = require('get-image-colors')


const getColorsFromJpgBuffer = (buffer) => {
    return getColors(buffer, 'image/jpg');
};

const getStringColors = (queryString) => {
    new Promise((resolve, reject) => {
        // Get image url matching string
        const imageUrls = getImageUrls(queryString);
        // Download image into buffer
        const buffer = curlImageToBuffer(imageUrls[0]);
        // Get colors from image buffer
        const colors = getColorsFromJpgBuffer(buffer);
        // Return colors to fulfil promise
        resolve(colors);
        throw {name: "getStringColorsError", message: "General error"}
    });
};

module.exports = getStringColors