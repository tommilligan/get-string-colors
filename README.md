# get-string-colors


[![npm](https://img.shields.io/npm/v/get-string-colors.svg)](https://www.npmjs.com/package/get-string-colors)
[![license](https://img.shields.io/github/license/tommilligan/get-string-colors.svg)](https://choosealicense.com/)

[![Travis branch](https://img.shields.io/travis/tommilligan/get-string-colors/develop.svg)](https://travis-ci.org/tommilligan/get-string-colors)
[![codecov](https://codecov.io/gh/tommilligan/get-string-colors/branch/develop/graph/badge.svg)](https://codecov.io/gh/tommilligan/get-string-colors)
[![David](https://img.shields.io/david/tommilligan/get-string-colors.svg)](https://david-dm.org/tommilligan/get-string-colors)


Get colors of a string using [google-images](https://www.npmjs.com/package/google-images), [got](https://www.npmjs.com/package/got) and [get-image-colors](https://www.npmjs.com/package/get-image-colors).


## Installation

Install from `npmjs.org`
```
yarn add get-string-colors
```


## Use

To interact with Google services, you will need to create a new [Custom Search Engine (CSE)](https://cse.google.com/cse/manage/all) and appropriate [API Key](https://console.developers.google.com/apis/dashboard).

Pass these to the constructor as you normally would sensitive data:
```
const GetStringColors = require("get-string-colors");

const getStringColors = new GetStringColors(process.env.GOOGLE_CSE_ID, process.env.GOOGLE_API_KEY);
getStringColors.getStringColors("grass").then(colors => {
    colors.map(color => {
        console.log(color.hex);
    })
})
```


## Development

Please ensure PRs are accompanied by comments and tests.
```
npm run test
```

