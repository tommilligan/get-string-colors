const fs = require('fs')
const buffer = fs.readFileSync('/Users/TMMilligan.SRP_IMPNET/Pictures/Sergey Svistunov - Owl and Mice.jpg')
const getColors = require('get-image-colors')

getColors(buffer, 'image/jpg').then(colors => {
  console.log(colors);
})

