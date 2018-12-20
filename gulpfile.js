/**
 * 
 * 19 December, 2019
 *
 * Deepraj Pandey
 *
 * Gulpfile for Project Wisteria
 */

'use strict';
var browserSync = require('browser-sync').create();
var del = require('del')
var gulp = require('gulp');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require('gulp-autoprefixer');
var concat = require('gulp-concat');
var cleanCSS = require('gulp-clean-css');
var uglify = require('gulp-uglify');
var cache = require('gulp-cache');
var imagemin = require('gulp-imagemin');
var inject = require('gulp-inject');
var pump = require('pump');

const reload = browserSync.reload;

var Paths = {
  dev: {
    here: './dev',
    js: './dev/assets/js/core',
    img: './dev/assets/img',
    fonts: './dev/assets/fonts',
    scss: './dev/assets/scss/**/**/*.scss',
    scss_toolkit: './dev/assets/scss/blk-design-system.scss',
    css: './dev/assets/css'
  },
  prod: {
    here: './prod',
    css: './prod/assets/css',
    js: './prod/assets/js',
    img: './prod/assets/img',
    fonts: './prod/assets/fonts'
  }
}

// Function to inject relative css and js file paths
// into html files in the directory (json) passed as argument
function injectPaths(allPaths) {
  // Where the injections will happen
  var target = gulp.src(allPaths.here+'/*.html');
  // All css and js sources
  // String concat since the path variables do not include the wildcards
  var sources = gulp.src([allPaths.css+'/*.css', allPaths.js+'/*.js'], {read: false})
  
  return target.pipe(inject(sources, {relative: true}))
  .pipe(gulp.dest(allPaths.here));
}


// Compiles `blk-design-system.scss` and puts the `blk-design-system.css` in dev/assets/css
// Then calls injectPaths with dev directory
gulp.task('compile-toolkit', function genCss(cb) {
  pump([
      gulp.src(Paths.dev.scss_toolkit, {sourcemaps: true}),
      // Generate Source Maps
      //.pipe(sourcemaps.init())
      sass({
        precision: 10,
        onError: console.error.bind(console, 'Sass error:')
      }),
      autoprefixer(),
      // injectPaths is called on end to make sure sass compiles before injecting new file
      gulp.dest(Paths.dev.css).on('end', function injectNewP() {
        // injection into dev folder
        return injectPaths(Paths.dev);
      })
    ],
    cb
  );
});

// Copies the html files from dev to prod
function copyHtml() {
  gulp.src(Paths.dev.here+'/*.html')
  .pipe(gulp.dest(Paths.prod.here));
}

// Concats, minifies and copies the resultant css file into production
gulp.task('styles', function prepStyles(cb) {
  copyHtml();
  pump([
      gulp.src(Paths.dev.css+'/*.css'),
      sourcemaps.init(),
      autoprefixer(),
      concat('main.min.css'),
      cleanCSS({debug: true}, function minify(deets) {
        console.log(`${deets.name}: ${deets.stats.originalSize}`);
        console.log(`${deets.name}: ${deets.stats.minifiedSize}`);
      }),
      sourcemaps.write('.'),
      gulp.dest(Paths.prod.css).on('end', function injectNewSt() {
        return injectPaths(Paths.prod);
      })
    ],
    cb
  );
});

// Concats, minifies, and copies js files to production
gulp.task('scripts', function prepScripts(cb) {
  copyHtml();
  pump([
      gulp.src(Paths.dev.js+'/*.js'),
      sourcemaps.init(),
      // Concatenate all js files
      concat('main.js'),
      // Minify
      uglify(),
      concat('main.min.js'),
      sourcemaps.write('.'),
      gulp.dest(Paths.prod.js).on('end', function injectNewSc() {
        return injectPaths(Paths.prod)
      })
    ],
    cb
  );
});

// Optimises images
gulp.task('images', function imgOptim(cb) {
  pump([
      gulp.src(Paths.dev.img+'/*.{svg,png,jpg,gif,ico}'),
      cache(imagemin([
        imagemin.gifsicle({interlaced: true}),
        imagemin.jpegtran({progressive: true}),
        imagemin.optipng({optimizationLevel: 5}),
        imagemin.svgo({
          plugins: [
            {removeViewBox: true},
            {cleanupIDs: false}
          ]
        })
      ])),
      gulp.dest(Paths.prod.img)
    ],
    cb
  );
});

// Misc - copy license to production
gulp.task('license', function copy() {
  return gulp.src('LICENSE')
  .pipe(gulp.dest(Paths.prod.here));
});

// Copy the fonts
gulp.task('fonts', function copyFonts() {
  return gulp.src(Paths.dev.fonts+'/*')
  .pipe(gulp.dest(Paths.prod.fonts));
});

// Clears production directory
gulp.task('clean', function rmRf() {
  return del('./prod').then(function log(paths) {
    console.log('Cleared production directory.');
  });
});

// Build production files
gulp.task('build', gulp.series('clean', 'compile-toolkit', 'fonts', 'styles', 'images', 'scripts', 'license'));


// Function to watch the scss variables
function watch() {
  gulp.watch(Paths.dev.scss, gulp.series('compile-toolkit'));
}

//  SERVERS  //

// development server (watches the .css and .js files in `dev/assets`)
gulp.task('serve:dev', function devServer () {
  browserSync.init({
    port: 5566,
    ui: {
      port: 5567
    },
    server: {
      baseDir: "./dev",
      index: "index.html"
    },
    watch: true,
    files: [Paths.dev.css, Paths.dev.js, Paths.dev.img],
    browser: "google chrome"
  });
  watch();
});

// serve from `prod`
// but first build production files
gulp.task('serve:prod', function devServer () {
  browserSync.init({
    port: 8080,
    ui: {
      port: 8090
    },
    server: {
      baseDir: "./prod"
    },
    watch: true,
    files: [Paths.prod.css, Paths.prod.js, Paths.prod.img],
    browser: "google chrome"
  });
  watch();
});

// default task is running dev-server
gulp.task('default', gulp.series('compile-toolkit', 'serve:dev'));
