const { series, src, dest, watch, parallel } = require('gulp');
const browserSync = require('browser-sync').create();
const sass = require('gulp-sass');
const cleanCss = require('gulp-clean-css');
const cssAutoprefixer = require('gulp-autoprefixer');
const imagemin = require('gulp-imagemin');

sass.compiler = require('node-sass');

// path definition
const [DEV_BASE_DIR, PROD_BASE_DIR] = ['./src', './prod'];
const paths = {
  src: {
    home: `${DEV_BASE_DIR}`,
    html: `${DEV_BASE_DIR}/**/*.html`,
    sass: `${DEV_BASE_DIR}/scss/**/*.scss`,
    js: `${DEV_BASE_DIR}/js/**/*.js`,
    jsFiles: `${DEV_BASE_DIR}/js/**/*.js`,
    css: `${DEV_BASE_DIR}/css`,
    cssFiles: `${DEV_BASE_DIR}/css/**/*.css`,
    media: `${DEV_BASE_DIR}/media/**/*`,
  },
  dest: {
    home: `${PROD_BASE_DIR}`,
    css: `${PROD_BASE_DIR}/css`,
    js: `${PROD_BASE_DIR}/js/`,
    media: `${PROD_BASE_DIR}/media/`,
  },
};

function compileSass(cb) {
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

const browserSyncReload = (cb) => {
  browserSync.reload();
  cb();
};

// WATCHER
function watchFiles() {
  watch(paths.src.sass, compileSass);
  watch(paths.src.html, browserSyncReload);
  watch(paths.src.js, browserSyncReload);
}
// LAUNCH SERVER
function staticServer() {
  browserSync.init({
    server: {
      baseDir: './src/',
    },
  });
}

// EXPORTS
exports.css = minifyCss;
exports.default = function startGulpDefault() {
  staticServer();
  watchFiles();
};

// IMAGE COMPRESSION
function compressImage(cb) {
  src(paths.src.media).pipe(imagemin()).pipe(dest(paths.dest.media));
  return cb();
}

// BUILD
function build(cb) {
  src(paths.src.html).pipe(dest(paths.dest.home));
  src(paths.src.sass)
    .pipe(sass().on('error', sass.logError))
    .pipe(cssAutoprefixer({ cascade: false }))
    .pipe(dest(paths.dest.css));
  src(paths.src.js).pipe(dest(paths.dest.js));
  compressImage(cb);
  return cb();
}

exports.build = build;
