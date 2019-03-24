const { src, dest, parallel, watch, series } = require('gulp');
const browsersync = require("browser-sync").create();
const sass = require('gulp-sass');
const minifCSS = require('gulp-csso')
const uglify = require('gulp-uglify');
const autoprefix = require('gulp-autoprefixer');
const rename = require("gulp-rename");
const archive = require('gulp-zip');
const plumber = require("gulp-plumber");
const notify = require("gulp-notify");
const webpackStream = require('webpack-stream');


function browserSync(done) {
  browsersync.init({
    server: {
      baseDir: "./dist/"
    },
    port: 3000
  });
  done();
}
// BrowserSync Reload
function browserSyncReload(done) {
  browsersync.reload();
  done();
}
function html() {
  return src('./src/**/*.html')
    .pipe(dest('./dist'))
}
function styles() {
  return src('./src/sass/main.sass')
    .pipe(plumber({
      errorHandler: function (err) {
        notify.onError({
          title: "Gulp error in " + err.plugin,
          message: err.toString()
        })(err);
      }
    }))
    .pipe(sass())
    .pipe(autoprefix({
      browsers: ['last 6 versions']
    }))
    .pipe(minifCSS())
    .pipe(rename({
      basename: "main",
      suffix: ".min",
    }))
    .pipe(dest('./dist/css'))
};


function js() {
  return src('./src/js/main.js')
    .pipe(plumber({
      errorHandler: function (err) {
        notify.onError({
          title: "Gulp error in " + err.plugin,
          message: err.toString()
        })(err);
      }
    }))
    .pipe(webpackStream({
      mode: "production",
      output: {
        filename: 'main.js',
      },
      module: {
        rules: [
          {
            test: /\.(js)$/,
            exclude: /(node_modules)/,
            loader: 'babel-loader',
            query: {
              presets: ["@babel/preset-env"]
            }
          }
        ]
      }
    }))
    // .pipe(uglify())
    // .pipe(rename({ suffix: '.min' }))
    .pipe(dest('./dist/js'))
};


function fonts() {
  return src('./src/fonts/**/*.*')
    .pipe(dest(('./dist/fonts')))
}

function watcher() {
  watch('./src/sass/**/*.sass', series(styles, browserSyncReload));
  watch('./src/js/**/*.js', series(js, browserSyncReload));
  watch('./src/fonts/**/*', series(fonts, browserSyncReload));
  watch('./src/**/*.html', series(html, browserSyncReload))
};


function zip() {
  return src('./dist/**/*')
    .pipe(archive('build.zip'))
    .pipe(dest('./dist'))
}

exports.js = js;
exports.styles = styles;
exports.fonts = fonts;
exports.watcher = watcher;
exports.html = html;

exports.build = parallel(js, styles, fonts, html)
exports.zip = series(js, styles, fonts, html, zip)
exports.default = parallel(watcher, browserSync) 