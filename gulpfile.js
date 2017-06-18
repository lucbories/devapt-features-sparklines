
'use strict'

var del = require('del')
var gulp = require('gulp')
var sourcemaps = require('gulp-sourcemaps')
var babel = require('gulp-babel')
var changed = require('gulp-changed')
var livereload = require('gulp-livereload')

var source = require('vinyl-source-stream')
var Buffer = require('vinyl-buffer')
var browserify = require('browserify')

var SRC_ALL_JS = 'src/**/*.js'

var DST = 'dist'
var DST_ALL_JS = DST
var DST_BROWSER_INDEX = './dist/index.js'
var DST_BROWSER_BUNDLE = 'devapt-features-sparklines.js'

const BABEL_CONFIG = {
	presets: ['es2015']
}


/*
	CLEAN DIST DIRECTORY
*/
gulp.task('clean',
	() => {
		return del(DST)
	}
)


/*
	BUILD ALL SRC/ JS FILES TO DIST/
		with sourcemap files
		build only changed files
*/
gulp.task('build_all_js',
	() => {
		return gulp.src(SRC_ALL_JS)
            .pipe(changed(DST_ALL_JS))
            .pipe(sourcemaps.init())
            .pipe( babel(BABEL_CONFIG) )
            .pipe(sourcemaps.write('.'))
            .pipe(gulp.dest(DST_ALL_JS))
	}
)

gulp.task('watch_all_js',
	() => {
		gulp.watch(SRC_ALL_JS, ['build_all_js'])
		.on('change',
			(path/*, stats*/) => {
				console.log('File ' + path + ' was changed, running watch_all_js...')
			}
		)
		.on('unlink',
			(path/*, stats*/) => {
				console.log('File ' + path + ' was deleted, running watch_all_js...')
			}
		)
	}
)



/*
    BUILD AND COPY ALL SRC/BROWSER FILES TO DIST/
        build all files
*/
// gulp.task('build_browser',
// 	() => {
// 		const browserify_settings = {
// 			entries: [DST_BROWSER_INDEX]
// 		}
// 		var bundler = browserify(browserify_settings)
		
// 		var stream = bundler.bundle()
// 			.on('error',
// 				function(err)
// 				{
// 					console.error(err)
// 					this.emit('end')
// 				}
// 			)
// 			.pipe( source(DST_BROWSER_BUNDLE) )
// 			// .pipe( changed(DST) )
// 			.pipe( buffer() )
// 			.pipe( sourcemaps.init() )
// 			.pipe( sourcemaps.write('.') )
// 			.pipe( gulp.dest(DST) )
// 			// .pipe( plugins.livereload() )

// 		return stream
// 	}
// )


gulp.task('build_browser_bundle',
	() => {
		return browserify( { entries: DST_BROWSER_INDEX } )
			.ignore('devapt')
			.external('client_runtime')
			.external('forge-browser')
			.external('ui')
			.require('./dist/sparklines_rendering_plugin.js', { expose:'sparklines_plugin' } )
			.bundle()
			.pipe( source(DST_BROWSER_BUNDLE) )
			.pipe( new Buffer() )
			.pipe(sourcemaps.write('.'))
			.pipe( gulp.dest(DST) )
			.pipe( livereload() )
	}
)



/*
	LIVE RELOAD SERVER
*/



/*
	DEFINE MAIN GULP TASKS
*/
gulp.task('default', gulp.series('build_all_js', 'build_browser_bundle'))

gulp.task('watch', gulp.series('build_all_js', 'build_browser_bundle', 'watch_all_js') )
