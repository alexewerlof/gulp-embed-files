var gulp = require('gulp');
var debug = require('gulp-debug');
var embedFiles = require('./../index.js');

gulp.task('default', function () {
  gulp.src('../test/mydir/**/*.txt')
    .pipe(embedFiles('output6.json'))
    .pipe(debug({title: 'files being embedded:'}))
    .pipe(gulp.dest('.'));
});