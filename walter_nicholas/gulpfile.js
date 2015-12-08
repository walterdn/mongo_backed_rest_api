var gulp = require('gulp');
var webpack = require('webpack-stream');
var sass = require('gulp-sass');
var minifyCSS = require('gulp-minify-css');
var sourcemaps = require('gulp-sourcemaps');

gulp.task('static:dev', function() {
  gulp.src('app/**/*.html')
  .pipe(gulp.dest('build/'));
});

gulp.task('cssFiles:dev', function() {
  gulp.src('app/scss/**/*.scss')
  .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(minifyCSS())
  .pipe(sourcemaps.write())
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
