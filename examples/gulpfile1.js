var gulp = require('gulp');
var wrapper = require('gulp-wrapper');
var embedFiles = require('./../index.js');

gulp.task('default', function () {
  gulp.src('../test/mydir/**/*')
    .pipe(embedFiles('output1.js', {
      space: 4,
      enc: {
        '.3DS' : 'base64',
        '.jpg' : 'base64',
        '.png' : 'base64'
      }
    }))
    .pipe(wrapper({
      //Assign the resulting object to the files variable
      header: 'var files = ',
      footer: ';'
    }))
    .pipe(gulp.dest('.'));
});