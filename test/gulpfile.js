var gulp = require('gulp');
var size = require('gulp-size');
var rename = require('gulp-rename');
var wrapper = require('gulp-wrapper');
var embedFiles = require('./../index.js');

gulp.task('default', function () {
  gulp.src('mydir/**/*')
    .pipe(embedFiles('contents.json', {
      replaceSep: '/',
      space: '\t',
      enc: {
        '.3DS' : 'base64'
      }
    }))
    .pipe(gulp.dest('./output/'))
    .pipe(rename({
      extname: '.js'
    }))
    .pipe(wrapper({
      header: 'var files = ',
      footer: ';'
    }))
    .pipe(size({showFiles: true}))
    .pipe(gulp.dest('./output/'));
});