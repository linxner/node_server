const gulp = require('gulp')
const connect = require('gulp-connect')


gulp.task('jade', () => {
    gulp.src('./views/*.jade')
        .pipe(connect.reload())
})
gulp.task('js', () => {
    gulp.src(['./public/*.js', './modules/*.js', './schems/*.js'])
        .pipe(connect.reload())
})


gulp.task('watch', () => {
    gulp.watch('./views/*.jade', ['jade'])
    gulp.watch('./public/*.js', ['js'])
})


gulp.task('server', () => {
    connect.server({
        root: './',
        port: 8000,
        livereload: true
    })
})

gulp.task('default', ['server', 'watch'])