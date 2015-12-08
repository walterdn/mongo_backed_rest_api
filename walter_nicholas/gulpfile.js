var gulp = require('gulp');
var webpack = require('webpack-stream');
var minifyCSS = require('gulp-minify-css');
var concatCSS = require('gulp-concat-css');

gulp.task('static:dev', function() {
  gulp.src('app/**/*.html')
  .pipe(gulp.dest('build/'));
});

gulp.task('cssFiles:dev', function() {
  return gulp.src([
    'app/css/base.css',
    'app/css/layout.css',
    'app/css/state.css'])
    .pipe(concatCSS('styles.min.css'))
    .pipe(minifyCSS())
  .pipe(gulp.dest('build/css/'));
});

gulp.task('css:watch', function () {
  gulp.watch('app/css/**/*.css', ['css:dev']);
});

gulp.task('webpack:dev', function() {
  return gulp.src('app/js/entry.js')
  .pipe(webpack({
    output: {
      filename: 'bundle.js'
    }
  }))
  .pipe(gulp.dest('build/'));
});

gulp.task('build:dev', ['webpack:dev', 'static:dev', 'cssFiles:dev']);
gulp.task('default', ['build:dev']);
