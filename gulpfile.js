var gulp = require('gulp');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var sourcemaps = require('gulp-sourcemaps');
var concat = require('gulp-concat');
var cleanCSS = require('gulp-clean-css');
var browserSync = require('browser-sync').create();
var gulpLoadPlugins = require('gulp-load-plugins');

const $ = gulpLoadPlugins();
const reload = browserSync.reload;

var Paths = {
  dev: {
    js: './dev/assets/js/core/',
    img: './dev/assets/img/',
    scss: './dev/assets/scss/**/**/*.scss',
    scss_toolkit: './dev/assets/scss/blk-design-system.scss',
    css: './dev/assets/css/'
  },
  prod: {
    css: './prod/assets/css/',
    js: './prod/assets/js/',
    img: './prod/assets/img/'
  }
}


// compiles `blk-design-system.scss` and puts the `blk-design-system.css` in dev/assets/css
gulp.task('compile-toolkit', function gen_css() {
  return gulp.src(Paths.dev.scss_toolkit, {sourcemaps: true})
    // Generate Source Maps
    //.pipe(sourcemaps.init())
    .pipe(sass({
      precision: 10,
      onError: console.error.bind(console, 'Sass error:')
    }))
    .pipe(autoprefixer())
    .pipe(gulp.dest(Paths.dev.css));
});

// if the scss variables are changed, recompile scss
gulp.task('watch-scss', function watch() {
  return gulp.watch(Paths.dev.scss, gulp.series('compile-toolkit'));
});

// development server (watches the .css and .js files in `dev/assets`)
gulp.task('serve:dev', function d () {
  browserSync.init({
    watch: true,
    server: {
      baseDir: "./dev/"
    },
    files: ['./dev/assets/css/*.css', './dev/assets/js/**/*.js'],
    browser: "google chrome"
  });
});

gulp.task('styles:dist')
gulp.task('default', gulp.parallel('serve:dev'));