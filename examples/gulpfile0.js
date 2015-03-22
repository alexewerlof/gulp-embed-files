var gulp = require('gulp');
var embedFiles = require('./../index.js');

gulp.task('default', function () {
  gulp.src('../test/mydir/**/*.txt')
    .pipe(embedFiles('output0.js'))
    .pipe(gulp.dest('.'));
});