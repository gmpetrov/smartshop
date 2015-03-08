'use strict';

var gulp = require('gulp');
var jade = require('gulp-jade');
var jshint = require('gulp-jshint');
var wiredep = require('wiredep').stream;
var sass   = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var $ = require('gulp-load-plugins')();

gulp.paths = {
	src: 'src',
	dist: 'dist',
	tmp: '.tmp',
	e2e: 'e2e'
};

require('require-dir')('./gulp');

gulp.task('default', ['clean'], function () {
	gulp.start('build');
});

// Scripts
gulp.task('scripts', function() {
  return gulp.src('./src/**/*.js')
    .pipe(concat('main.js'))
    .pipe(gulp.dest('dist/scripts'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(uglify())
    .pipe(gulp.dest('dist/scripts'))
    .pipe(notify({ message: 'Scripts task complete' }));
});

gulp.task('jshint', function(){
	return 	gulp.src('./src/**/*.js')
			.pipe(jshint())
			.pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('jade', function(){
	return	gulp.src('./src/master/jade/**/*.jade')
			.pipe(jade({
				pretty: true
			}))
			.pipe(gulp.dest('./src/app/templates/'));
});

gulp.task('wiredep', function(){
	return	gulp.src('./src/index.html')
			.pipe(wiredep())
			.pipe(gulp.dest('./src/'));
});

gulp.task('sass', function(){


	var sassOptions = {
		style: 'expanded'
	};

	var injectFiles = gulp.src([
		'./src/{app,components}/**/*.scss',
		'!' + './src' + '/app/index.scss',
		'!' + './src' + '/app/vendor.scss'
		], { read: false });

	var injectOptions = {
		transform: function(filePath) {
			filePath = filePath.replace('./src' + '/app/', '');
			filePath = filePath.replace('./src' + '/components/', '../components/');
			return '@import \'' + filePath + '\';';
		},
		starttag: '// injector',
		endtag: '// endinjector',
		addRootSlash: false
	};

	var indexFilter = $.filter('index.scss');

	return gulp.src([
		'./src' + '/app/index.scss',
		'./src' + '/app/vendor.scss'
		])
	.pipe(indexFilter)
	.pipe($.inject(injectFiles, injectOptions))
	.pipe(indexFilter.restore())
	.pipe($.sass(sassOptions))

	.pipe($.autoprefixer())
	.on('error', function handleError(err) {
		console.error(err.toString());
		this.emit('end');
	})
	.pipe(gulp.dest('./.tmp' + '/serve/app/'));
	// return	gulp.src('./src/app/*.scss')
	// 		.pipe(sourcemaps.init())  // Process the original sources
 //      		.pipe(sass())
 //    		.pipe(sourcemaps.write())
	// 		.pipe(gulp.dest('./dist/styles/'));
});

gulp.task('watch', function(){
	gulp.watch('./src/app/index.scss', ['sass']);
	gulp.watch('./src/**/*.js', ['jshint']);
	gulp.watch('./src/master/jade/**/*.jade', ['jade']);
	gulp.watch('./bower_components/**/*', ['wiredep']);
});

gulp.task('go', ['watch', 'serve']);
