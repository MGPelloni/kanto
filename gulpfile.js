/**
 * Gulp: https://gulpjs.com/
 * To use this file, run "npm install" and then "npm start" in your terminal at the root of the main folder.
 */	

let gulp = require('gulp'); // Workflow Automation

	// NPM Packages
	sass = require('gulp-sass'); // Converting our SASS into CSS
	prefix = require('gulp-autoprefixer'); // Prefixes CSS to work with browsers
	cleanCSS = require('gulp-clean-css'); // Minify CSS
	concat = require('gulp-concat'); // Concatenate files
	uglify = require('gulp-uglify-es').default; // Minify JS
	babel = require('gulp-babel'); // Transpile JS

	// Paths
	src = 'src'; // The source files location
	dest = 'dist'; // Destination folder
	modules = 'node_modules'; // Node modules added by NPM

	// Watch files
	watch = {
		scss: `${src}/scss/**/*.scss`,
		js: `${src}/js/**/*.js`,
	};

	// The SCSS files that need to be compiled in order
    scss = [
        `${src}/scss/main.scss`
	];
	
	// The JS files that need to be compiled in order
    js = [
		`${modules}/pixi.js/dist/pixi.min.js`, 
		`${src}/js/**/*.js`,
		`${src}/js/main.js`
	];
	

gulp.task('scss', function(){
    return gulp.src(scss)
        .pipe(sass())
        .pipe(prefix('last 2 versions'))
		.pipe(concat('kanto.min.css'))
        .pipe(cleanCSS({compatibility: 'ie8'}))
        .pipe(gulp.dest(`${dest}`))
});

gulp.task('js', function(done){
    return gulp.src(js)
		.pipe(concat('kanto.min.js'))
		// .pipe(babel())
		// .pipe(uglify())
        .pipe(gulp.dest(`${dest}`))
});

gulp.task('watch', function () {
    gulp.watch(watch.scss, gulp.series('scss'));
	gulp.watch(watch.js, gulp.series('js'));
});

gulp.task('default', gulp.series('scss', 'js', 'watch'));
gulp.task('compile', gulp.series('scss', 'js'));