var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();
var bowerFiles = require('main-bower-files');
var browserSync = require('browser-sync');
var es = require('event-stream');
var del = require('del');
var ngrok = require('ngrok');


var paths = {
	scripts: './app/**/*.js',
	styles: './app/**/*.css',
	images: './app/img/**/*',
	index: './app/index.html',
	partialas: ['app/**/*.html', '!app/index.html'],
	distDev: './dist.distDev',
	distProd: './dist.prod'
};
// pipe segments
var pipes = {};
pipes.orderedVendorScripts = function(){
	return plugins.order(['jquery.js','angular.js']);
};
pipes.builtVendorScriptsDev = function(){
	return gulp.src(bowerFiles('**/*.js'))
				.pipe(gulp.dest(paths.distDev + '/bower_components'));
};

pipes.builtVendorCSSDev = function(){
	return gulp.src(bowerFiles('**/*.css'))
				.pipe(gulp.dest(paths.distDev + '/bower_components/css'));
};

pipes.buildVendorFontsDev = function(){
	return gulp.src(bowerFiles(['**/*.eot','**/*.svg','**/*.ttf','**/*.woff','**/*.woff2']))
				.pipe(gulp.dest(paths.distDev + '/bower_components/fonts'));
};

pipes.builtAppScriptsDev = function(){
	return gulp.src(paths.scripts)
	.pipe(plugins.concat('app.js'))
	.pipe(gulp.dest(paths.distDev));
};

pipes.builtPartialsFilesDev = function(){
	return gulp.src(paths.partialas)
	.pipe(gulp.dest(paths.distDev));
};

pipes.builtStylesDev = function(){
	return gulp.src(paths.styles)
	.pipe(plugins.concat('./css/style.css'))
	.pipe(gulp.dest(paths.distDev));
};

pipes.processedImagesDev = function(){
	return gulp.src(paths.images)
	.pipe(gulp.dest(paths.distDev + '/img'));
};

pipes.buildIndexDev = function() {
	
	var orderVenderScripts = pipes.builtVendorScriptsDev()
		.pipe(pipes.orderedVendorScripts());
	
	var orderVenderCSS = pipes.builtVendorCSSDev();

	var orderVenderFonts = pipes.buildVendorFontsDev();
	
	var orderAppScripts = pipes.builtAppScriptsDev();

	var appStyles = pipes.builtStylesDev();

	return gulp.src(paths.index)
	.pipe(gulp.dest(paths.distDev))
	.pipe(plugins.inject(orderVenderScripts, {relative : true, name : 'bower'}))
	.pipe(plugins.inject(orderAppScripts, {relative : true}))
	.pipe(plugins.inject(orderVenderCSS, {relative : true}))
	.pipe(plugins.inject(orderVenderFonts, {relative : true}))
	.pipe(plugins.inject(appStyles, {relative : true}))
	.pipe(gulp.dest(paths.distDev));
};



pipes.builtAppDev = function(){
	return es.merge(pipes.buildIndexDev(), pipes.builtPartialsFilesDev(), pipes.processedImagesDev());
};
//task
gulp.task('clean-dev', function(){
	return del(paths.distDev);
});

gulp.task('build-app-scripts-dev', pipes.builtAppScriptsDev);

gulp.task('build-index-dev', pipes.buildIndexDev);

gulp.task('build-partial-dev', pipes.builtPartialsFilesDev);

gulp.task('built-app-dev', pipes.builtAppDev);

gulp.task('clean-build-app-dev', ['clean-dev'], pipes.builtAppDev);

gulp.task('watch-dev', ['clean-build-app-dev'], function(){
	var reload = browserSync.reload;

	browserSync({
		port: 8000,
		server: {
			baseDir: paths.distDev
		}
	    }, function (err, bs) { 
			ngrok.connect(bs.options.get('port'), function (err, url) {
 
   		}); 
		});
	gulp.watch(paths.index, function(){
		return pipes.buildIndexDev()
		.pipe(reload({stream : true}))
	});
	gulp.watch(paths.scripts, function(){
		return pipes.builtAppScriptsDev()
		.pipe(reload({stream : true}))
	});

	gulp.watch(paths.partialas, function(){
		return pipes.builtPartialsFilesDev()
		.pipe(reload({stream : true}))
	});

	gulp.watch(paths.styles, function(){
		return pipes.builtStylesDev()
		.pipe(reload({stream : true}))
	});

	gulp.watch(paths.styles, function(){
		return pipes.processedImagesDev()
		.pipe(reload({stream : true}))
	});
});

gulp.task('default', ['watch-dev']);