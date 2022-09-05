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
uglify = require('gulp-uglify'); // Minify JS

let client_files_js = [
    `node_modules/pixi.js/dist/pixi.min.js`, 
    `node_modules/howler/dist/howler.min.js`, 
    `node_modules/socket.io/client-dist/socket.io.js`,
    `src/client/js/**/*.js`,
    `src/client/js/main.js`
];

let server_files_js = [
  `src/server/**/*.js`
]

function client_scss() {
  return src('src/client/scss/main.scss')
  .pipe(concat('kanto.min.css'))
  .pipe(sass())
  .pipe(prefix('last 2 versions'))
  .pipe(cleanCSS({level: {1: {specialComments: 0}}}))
  .pipe(dest('dist'))
}

function client_js() {
  return src(client_files_js)
  .pipe(concat('kanto.min.js'))
  .pipe(babel())
  .pipe(uglify())
  .pipe(dest('dist'))
}

function server_js() {
  return src(server_files_js)
  .pipe(concat('index.js'))
  .pipe(babel())
  .pipe(uglify())
  .pipe(dest('./'))
}

function monitor() {
  watch('src/client/scss/**/*.scss', series(client_scss));
  watch('src/client/js/**/*.js', series(client_js));
  watch('src/server/**/*.js', series(server_js));
};

exports.default = series(client_scss, client_js, server_js, monitor);
exports.compile = series(client_scss, client_js, server_js);