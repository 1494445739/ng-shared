const gulp = require('gulp')
const inlineNg2Template = require('gulp-inline-ng2-template')

gulp.task('inline',function(){
  const result = gulp.src('src/**/*.ts')
    .pipe(inlineNg2Template({ useRelativePaths: true }))
    .pipe(gulp.dest('temp/'))
})