var gulp = require('gulp');
var gcallback = require('gulp-callback');
var fc2json = require('./../index.js');

exports.testItReturnsSomething = function(test){
  test.expect(1);
  gulp.src('my-files/**/*')
    .pipe(fc2json('contents.json'))
    .pipe(gulp.dest('./dist/'))
    .pipe(gcallback(function () {
      test.ok(true, 'Reached the callback');
      test.done();
    }));
  //test.ok(false, "this assertion should fail");
  //test.done();
};