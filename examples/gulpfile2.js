var umd = require('gulp-umd');
var gulp = require('gulp');
var wrapper = require('gulp-wrapper');
var embedFiles = require('./../index.js');

gulp.task('default', function () {
  gulp.src('../test/mydir/**/*')
    .pipe(embedFiles('output2.js', {
      replaceSep: '/',
      space: 4,
      enc: {
        '.3DS' : 'base64',
        '.jpg' : 'base64',
        '.png' : 'base64'
      }
    }))
    //Define a variable in the module
    .pipe(wrapper({
      header: 'var files = ',
      footer: ';'
    }))
    //Use the UMD pattern to expose it
    .pipe(umd({
      exports: function(file) {
        return 'files';
      }
    }))
    .pipe(gulp.dest('.'));
});