var gulp = require('gulp');
var gutil = require('gulp-util');
var bower = require('bower');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var less = require('gulp-less');
var path = require('path');
var minifyCss = require('gulp-minify-css');
var streamqueue = require('streamqueue');
var rename = require('gulp-rename');
var sh = require('shelljs');

var paths = {
  sass: ['./scss/**/*.scss']
};


gulp.task('sass', function(done) {
  gulp.src('./scss/ionic.app.scss')
    .pipe(sass())
    .on('error', sass.logError)
    .pipe(gulp.dest('./www/css/'))
    .pipe(minifyCss({
      keepSpecialComments: 0
    }))
    .pipe(rename({ extname: '.min.css' }))
    .pipe(gulp.dest('./www/css/'))
    .on('end', done);
});




gulp.task('less', function(){
  console.log( path.join(__dirname, 'less', 'includes'))
	return gulp.src('build/less/screen.less')
		.pipe(less({
      paths: [ path.join(__dirname, 'less') ]
		}))
		.pipe(gulp.dest('www/css/'))
})




gulp.task('scripts', function(){
  return streamqueue({ objectMode: true },
    gulp.src('build/vendor/*.js'),
    gulp.src('build/js/app.js'),
    gulp.src('build/js/routes.js'),
    //gulp.src('build/js/filters.js'),
    //gulp.src('build/js/directives.js'),
    gulp.src('build/js/services/*.js'),
    gulp.src('build/js/controllers/*.js')
  )
  .pipe(concat('app-min.js'))
  .pipe(gulp.dest('www/js'));
});


gulp.task('watch', function() {
  gulp.watch('build/js/**/*.js', ['scripts'] );
  gulp.watch('build/less/*.less', ['less'] )
  //gulp.watch(paths.sass, ['sass']);
});

gulp.task('default', ['watch']);


/*
gulp.task('install', ['git-check'], function() {
  return bower.commands.install()
    .on('log', function(data) {
      gutil.log('bower', gutil.colors.cyan(data.id), data.message);
    });
});
*/

/*
gulp.task('git-check', function(done) {
  if (!sh.which('git')) {
    console.log(
      '  ' + gutil.colors.red('Git is not installed.'),
      '\n  Git, the version control system, is required to download Ionic.',
      '\n  Download git here:', gutil.colors.cyan('http://git-scm.com/downloads') + '.',
      '\n  Once git is installed, run \'' + gutil.colors.cyan('gulp install') + '\' again.'
    );
    process.exit(1);
  }
  done();
});
*/
