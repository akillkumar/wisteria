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
var pump = require('pump');

const reload = browserSync.reload;

var Paths = {
  dev: './dev',
  prod: './prod'
}

// Clears production directory
gulp.task('clean', function rmRf() {
  return del('./prod').then(function log(paths) {
    console.log('Cleared production directory.');
  });
});

// Copy all files to production
gulp.task('copy', function copy(cb) {
  pump([
      gulp.src(Paths.dev+'/**/**/**/*'),
      gulp.dest(Paths.prod)
    ],
    cb
  );
});

gulp.task('build', gulp.series('clean', 'copy'));

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
    files: [Paths.dev]
  });
});

// serve from `prod`
// but first build production files
gulp.task('serve:prod', function devServer () {
  browserSync.init({
    port: 8080,
    ui: {
      port: 8081
    },
    server: {
      baseDir: "./prod"
    },
    watch: true,
    files: [Paths.prod]
  });
});

// default task is running dev-server
gulp.task('default', gulp.series('build'));
