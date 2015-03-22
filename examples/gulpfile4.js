var gulp = require('gulp');
var embedFiles = require('./../index.js');

gulp.task('default', function () {
  gulp.src('../test/mydir/**/*.txt')
    .pipe(embedFiles('output4.json', {
      //Use hex encoding instead of utf-8
      enc: {
        '.txt': 'hex'
      }
    }))
    .pipe(gulp.dest('.'));
});