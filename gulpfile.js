var gulp = require('gulp');
var rename = require('gulp-rename');
var browserify = require('gulp-browserify');
var uglify = require('gulp-uglify');

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
  gulp.src('./src/js/app.js')
    .pipe(browserify({
      debug: true
    }))
    .pipe(rename('bundle.js'))
    .pipe(gulp.dest('./public/js'))
    .pipe(uglify())
    .pipe(rename('bundle.min.js'))
    .pipe(gulp.dest('./public/js'));
});

gulp.task('watch', function() {

  // Watch .js files
  gulp.watch('./public/js/**/*.js', ['scripts']);


});
