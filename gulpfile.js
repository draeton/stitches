'use strict';
// generated on 2014-06-30 using generator-gulp-webapp 0.1.0

var gulp = require('gulp');
var argv = require('yargs').argv;

// load plugins
var $ = require('gulp-load-plugins')();

gulp.task('styles', function () {
	return gulp.src('app/styles/main.scss')
		.pipe($.rubySass({
			style: 'expanded',
			precision: 10
		}))
		.pipe($.autoprefixer('last 1 version'))
		.pipe(gulp.dest('.tmp/styles'))
		.pipe($.size());
});

gulp.task('scripts', function () {
	return gulp.src('app/scripts/main.js')
		.pipe($.jshint())
		.pipe($.jshint.reporter(require('jshint-stylish')))
		.pipe($.browserify({
			debug : !argv.production,
			transform: [
				'hbsfy'
			]
		}))
		.on('error', function(err) {
			console.log(err);
		})
		.pipe($.rename('app.js'))
		.pipe(gulp.dest('.tmp/scripts'))
		.pipe($.size());
});

gulp.task('html', ['styles', 'scripts'], function () {
	var jsFilter = $.filter('**/*.js');
	var cssFilter = $.filter('**/*.css');

	return gulp.src('app/*.html')
		.pipe($.useref.assets({searchPath: '{.tmp,app}'}))
		.pipe(jsFilter)
		.pipe($.uglify())
		.pipe(jsFilter.restore())
		.pipe(cssFilter)
		.pipe($.csso())
		.pipe(cssFilter.restore())
		.pipe($.useref.restore())
		.pipe($.useref())
		.pipe(gulp.dest('dist'))
		.pipe($.size());
});

gulp.task('images', function () {
	return gulp.src('app/images/**/*')
		.pipe($.cache($.imagemin({
			optimizationLevel: 3,
			progressive: true,
			interlaced: true
		})))
		.pipe(gulp.dest('dist/images'))
		.pipe($.size());
});

gulp.task('fonts', function () {
	return $.bowerFiles()
		.pipe($.filter('**/*.{eot,svg,ttf,woff}'))
		.pipe($.flatten())
		.pipe(gulp.dest('dist/fonts'))
		.pipe($.size());
});

gulp.task('extras', function () {
	return gulp.src(['app/*.*', '!app/*.html'], { dot: true })
		.pipe(gulp.dest('dist'));
});

gulp.task('clean', function () {
	return gulp.src(['.tmp', 'dist'], { read: false }).pipe($.clean());
});

gulp.task('build', ['html', 'images', 'fonts', 'extras']);

gulp.task('default', ['clean'], function () {
	gulp.start('build');
});

gulp.task('connect', function () {
	var connect = require('connect');
	var app = connect()
		.use(require('connect-livereload')({ port: 35729 }))
		.use(connect.static('app'))
		.use(connect.static('.tmp'))
		.use(connect.directory('app'));

	require('http').createServer(app)
		.listen(9000)
		.on('listening', function () {
			console.log('Started connect web server on http://localhost:9000');
		});
});

gulp.task('serve', ['connect', 'scripts', 'styles'], function () {
	require('opn')('http://localhost:9000');
});

// inject bower components
gulp.task('wiredep', function () {
	var wiredep = require('wiredep').stream;

	gulp.src('app/styles/*.scss')
		.pipe(wiredep({
			directory: 'app/bower_components'
		}))
		.pipe(gulp.dest('app/styles'));

	gulp.src('app/*.html')
		.pipe(wiredep({
			directory: 'app/bower_components',
			exclude: ['bootstrap-sass-official']
		}))
		.pipe(gulp.dest('app'));
});

gulp.task('watch', ['connect', 'serve'], function () {
	var server = $.livereload();

	// watch for changes

	gulp.watch([
		'app/*.html',
		'.tmp/styles/**/*.css',
		'.tmp/scripts/**/*.js',
		'app/scripts/**/*.hbs',
		'app/images/**/*'
	]).on('change', function (file) {
		server.changed(file.path);
	});

	gulp.watch('app/styles/**/*.scss', ['styles']);
	gulp.watch('app/scripts/**/*.js', ['scripts']);
	gulp.watch('app/scripts/**/*.hbs', ['scripts']);
	gulp.watch('app/images/**/*', ['images']);
	gulp.watch('bower.json', ['wiredep']);
});
