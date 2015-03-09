'use strict';

var gulp = require('gulp');
var sourcemaps = require('gulp-sourcemaps');
var $ = require('gulp-load-plugins')();
var wiredep = require('wiredep').stream;

gulp.paths = {
	src: 'src',
	dist: 'dist',
	tmp: '.tmp',
	e2e: 'e2e'
};

require('require-dir')('./gulp');

function getTask(task){
	return require('./gulp-tasks/' + task)(gulp, $)
};

gulp.task('default', ['clean', 'html-to-prod'], function () {
	gulp.start('build');
});

gulp.task('html-to-prod', ['jade'], getTask('html-to-prod.js'));
gulp.task('jade', getTask('jade.js'));
gulp.task('sass', getTask('sass.js'));

gulp.task('jshint', function(){
	return 	gulp.src('./src/**/*.js')
			.pipe($.jshint())
			.pipe($.jshint.reporter('jshint-stylish'));
});


gulp.task('wiredep', function(){
	return	gulp.src('./src/index.html')
			.pipe(wiredep())
			.pipe(gulp.dest('./src/'));
});


gulp.task('watch', function(){
	gulp.watch('./src/app/index.scss', ['sass']);
	gulp.watch('./src/**/*.js', ['jshint', 'inject']);
	gulp.watch('./src/master/jade/**/*.jade', ['jade']);
	gulp.watch('./bower_components/**/*', ['wiredep']);
});

gulp.task('go', ['watch', 'serve']);

// Scripts
// gulp.task('scripts', function() {
//   return gulp.src('./src/**/*.js')
//     .pipe(concat('main.js'))
//     .pipe(gulp.dest('dist/scripts'))
//     .pipe(rename({ suffix: '.min' }))
//     .pipe(uglify())
//     .pipe(gulp.dest('dist/scripts'))
//     .pipe($.notify({ message: 'Scripts task complete' }));
// });