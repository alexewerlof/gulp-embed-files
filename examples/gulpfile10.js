var gulp = require('gulp');
var debug = require('gulp-debug');
var embedFiles = require('./../index.js');

gulp.task('default', function () {
  //Exclude all the css files
  gulp.src(['../test/mydir/biary/**/*', '../test/mydir/img/**/*.css'])
    //print the list of files being fed into gulp-embed-files plugin just to be sure
    .pipe(debug())
    .pipe(embedFiles('output7.json', {
      space: 1
    }))
    .pipe(gulp.dest('.'));
});