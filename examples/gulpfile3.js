var gulp = require('gulp');
var size = require('gulp-size');
var embedFiles = require('./../index.js');

gulp.task('default', function () {
  gulp.src('../test/mydir/**/*.3DS')
    .pipe(embedFiles('output3.json'))
    .pipe(size({showFiles: true}))
    .pipe(gulp.dest('.'));
});