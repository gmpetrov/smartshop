module.exports = function(gulp, plugins){
	return function(){
		gulp.src('./src/app/**/*.html')
		.pipe(gulp.dest('./dist/app'))
		.pipe(plugins.notify({ message: 'html_to_prod task complete' }));
	};
};