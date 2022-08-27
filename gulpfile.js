/**
* Gulp: https://gulpjs.com/
* To use this file, run "npm install" and then "npm start" in your terminal at the root of the theme folder.
*/	

const { series, watch, src, dest } = require('gulp'), // Workflow Automation
concat = require('gulp-concat'), // Concatenate and rename files
sass = require('gulp-dart-sass'), // Converting our SASS into CSS
prefix = require('gulp-autoprefixer'), // Prefixes CSS to work with browsers
cleanCSS = require('gulp-clean-css'), // Minify CSS
babel = require('gulp-babel'), // Transpile JS
uglify = require('gulp-uglify'), // Minify JS
files_js = [
    `node_modules/pixi.js/dist/pixi.min.js`, 
    `node_modules/howler/dist/howler.min.js`, 
    `node_modules/socket.io/client-dist/socket.io.js`,
    `src/js/**/*.js`,
    `src/js/main.js`
];

function scss() {
  return src('src/scss/main.scss')
  .pipe(concat('kanto.min.css'))
  .pipe(sass())
  .pipe(prefix('last 2 versions'))
  .pipe(cleanCSS({level: {1: {specialComments: 0}}}))
  .pipe(dest('dist'))
}


function js() {
  return src(files_js)
  .pipe(concat('kanto.min.js'))
  .pipe(babel())
  .pipe(uglify())
  .pipe(dest('dist'))
}

function monitor() {
  watch('src/scss/**/*.scss', series(scss));
  watch('src/js/**/*.js', series(js));
};

exports.default = series(scss, js, monitor);
exports.compile = series(scss, js);