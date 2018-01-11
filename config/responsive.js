const $ = require('gulp-load-plugins')()

module.exports = {



  '*.jpg': [{
          width: 300,
          rename: {
            suffix: '-300px',
            extname: '.jpg',
          },
          format: 'jpeg',
        }, {
          width: 600,
          rename: {
            suffix: '-600px',
            extname: '.jpg',
          },
          // format option can be omitted because
          // format of output image is detected from new filename
          // format: 'jpeg'
        }, {
          width: 1900,
          rename: {
            suffix: '-1900px',
            extname: '.jpg',
          },
          // Do not enlarge the output image if the input image are already less than the required dimensions.
          withoutEnlargement: true,
        }]




}
