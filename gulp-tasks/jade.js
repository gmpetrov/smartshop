module.exports = function(gulp, plugins){
	return function(){
		gulp.src('./src/master/jade/**/*.jade')
		.pipe(plugins.jade({
			pretty: true
		}))
		.pipe(gulp.dest('./src/app/templates/'));
	}
};