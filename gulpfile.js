const { series, src, dest, watch, parallel } = require('gulp');
const browserSync = require('browser-sync').create();
const sass = require('gulp-sass');
const cleanCss = require('gulp-clean-css');
const cssAutoprefixer = require('gulp-autoprefixer');

sass.compiler = require('node-sass');

// path definition
const paths = {
  src: {
    home: './src',
    html: './src/**/*.html',
    sass: './src/scss/**/*.scss',
    js: './src/js/**/*.js',
    cssFiles: './src/css/**/*.css',
    css: './src/css',
  },
};
function compileSass(cb) {
  console.log('compilling sass');
  src(paths.src.sass)
    .pipe(sass().on('error', sass.logError))
    .pipe(cssAutoprefixer({ cascade: false }))
    .pipe(dest(paths.src.css))
    .pipe(browserSync.stream());
  cb();
}
function minifyCss(cb) {
  src(paths.src.cssFiles)
    .pipe(cleanCss({ compatibility: 'ie8' }))
    .pipe(dest(paths.src.css));
  cb();
}

function defaultTask(cb) {
  console.log('gulp default !!!');
  cb();
}

// WATCHERS
function watchSass() {
  watch(
    paths.src.sass,
    series(compileSass, (cb) => {
      browserSync.reload();
      cb();
    })
  );
}
function watchHtml() {
  watch(paths.src.html, (cb) => {
    browserSync.reload();
    cb();
  });
}
function watchJS() {
  watch(paths.src.js, (cb) => {
    browserSync.reload();
    cb();
  });
}

// LAUNCH SERVER
function staticServer(cb) {
  browserSync.init({
    server: {
      baseDir: './src/',
    },
  });
  cb();
}

// EXPORTS
exports.css = minifyCss;
exports.sass = watchSass;
exports.default = function (cb) {
  staticServer(cb);
  watchSass();
  watchHtml();
  watchJS();
};
