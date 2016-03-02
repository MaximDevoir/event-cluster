import gulp from 'gulp';
import gutil from 'gulp-util';
import eslint from 'gulp-eslint';

import config from '../config';

// create a default task and just log a message
gulp.task('default', () => {
  return gutil.log('Gulp is running!');
});

gulp.task("lint:js", () => {
  return gulp.src(config.js.src)
    .pipe(eslint({
      fix: true
    }))
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});
