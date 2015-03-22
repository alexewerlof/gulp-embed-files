var gulp = require('gulp');
var embedFiles = require('./../index.js');

gulp.task('default', function () {
  gulp.src('../test/mydir/**/*.txt')
    .pipe(embedFiles('output5.json', {
      //By default use base64 encoding when the extension doesn't have a explicit definition in options.enc
      encDefault: 'base64'
    }))
    .pipe(gulp.dest('.'));
});