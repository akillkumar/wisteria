var gulp = require('gulp');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var sourcemaps = require('gulp-sourcemaps');
var concat = require('gulp-concat');
var cleanCSS = require('gulp-clean-css');
var browserSync = require('browser-sync').create();
var inject = require('gulp-inject');
var uglify = require('gulp-uglify');
var pump = require('pump');


const reload = browserSync.reload;

var Paths = {
  dev: {
    here: './dev',
    js: './dev/assets/js/core',
    img: './dev/assets/img',
    scss: './dev/assets/scss/**/**/*.scss',
    scss_toolkit: './dev/assets/scss/blk-design-system.scss',
    css: './dev/assets/css'
  },
  prod: {
    here: './prod',
    css: './prod/assets/css',
    js: './prod/assets/js',
    img: './prod/assets/img'
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
      gulp.dest(Paths.dev.css).on('end', function callNext() {
        // injection into dev folder
        return injectPaths(Paths.dev);
      })
    ],
    cb
  );
});

function copyHtml() {
  gulp.src(Paths.dev.here+'/*.html')
  .pipe(gulp.dest(Paths.prod.here));
}

// concats, minifies and copies the resultant css file into production
gulp.task('styles', function prepStyles() {
  copyHtml();
  return gulp.src(Paths.dev.css+'/*.css')
  .pipe(sourcemaps.init())
  .pipe(autoprefixer())
  .pipe(concat('main.min.css'))
  .pipe(cleanCSS({debug: true}, function minify(deets) {
    console.log(`${deets.name}: ${deets.stats.originalSize}`);
    console.log(`${deets.name}: ${deets.stats.minifiedSize}`);
  }))
  .pipe(sourcemaps.write('.'))
  .pipe(gulp.dest(Paths.prod.css))
  .on('end', function callNext() {
    return injectPaths(Paths.prod);
  });
});

// copies js files to production
gulp.task('scripts', function prepScripts() {
  copyHtml();
  return gulp.src(Paths.dev.js+'/*.js')
  .pipe(gulp.dest())
});

//gulp.task('build:prod', gulp.series('compile-toolkit', 'styles', 'images', 'scripts'));

// if the scss variables are changed, recompile scss
gulp.task('watch', function watch() {
  gulp.watch(Paths.dev.scss, gulp.series('compile-toolkit'));
  gulp.watch([Paths.dev.css, Paths.dev.js], injectPaths(Paths.dev));
});

// development server (watches the .css and .js files in `dev/assets`)
gulp.task('serve:dev', function devServer () {
  browserSync.init({
    watch: true,
    server: {
      baseDir: "./dev/"
    },
    files: ['./dev/assets/css/*.css', './dev/assets/js/**/*.js'],
    browser: "google chrome"
  });
});


gulp.task('default', gulp.parallel('serve:dev'));


















