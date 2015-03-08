module.exports = function(gulp, plugins){
	return function(){
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

		var indexFilter = plugins.filter('index.scss');

		return gulp.src([
			'./src' + '/app/index.scss',
			'./src' + '/app/vendor.scss'
			])
		.pipe(indexFilter)
		.pipe(plugins.inject(injectFiles, injectOptions))
		.pipe(indexFilter.restore())
		.pipe(plugins.sass(sassOptions))

		.pipe(plugins.autoprefixer())
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
	};
};