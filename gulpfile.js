
'use strict'

var del = require('del')
var gulp = require('gulp')
var sourcemaps = require('gulp-sourcemaps')
var babel = require('gulp-babel')
var changed = require('gulp-changed')



var SRC_ALL_JS = 'src/**/*.js'

var DST = 'dist'
var DST_ALL_JS = DST

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
	(/*callback*/) => {
		var watcher_public_js = gulp.watch(SRC_ALL_JS, ['build_all_js'])
		watcher_public_js.on('change',
			(event) => {
				console.log('File ' + event.path + ' was ' + event.type + ', running tasks...')
			}
		)
	}
)



/*
	LIVE RELOAD SERVER
*/



/*
	DEFINE MAIN GULP TASKS
*/
gulp.task('default', ['build_all_js'])

gulp.task('watch', ['build_all_js', 'watch_all_js'])
