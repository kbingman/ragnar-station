var source = require('vinyl-source-stream');
var browserify = require('browserify');
var gulp = require('gulp');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var streamify = require('gulp-streamify');

gulp.task('styles', function() {
  gulp.src('./src/sass/app.scss')
    .pipe(sass({
      errLogToConsole: true
    }))
    .pipe(minify({ keepBreaks:true }))
    .pipe(rename('bundle.css'))
    .pipe(gulp.dest('./public/css'));
});

gulp.task('scripts', function() {
  var bundleStream = browserify('./src/js/app.js', { debug: true })
    .transform('hoganify')
    .bundle();

  bundleStream
    .pipe(source('app.js'))
    .pipe(rename('bundle.js'))
    .pipe(gulp.dest('./public/js'))
    .pipe(streamify(uglify()))
    .pipe(rename('bundle.min.js'))
    .pipe(gulp.dest('./public/js'))
});

gulp.task('watch', function() {

  // Watch .js files
  gulp.watch('./src/js/**/*.js', ['scripts']);
  gulp.watch('./templates/**/*.hogan', ['scripts']);

});
