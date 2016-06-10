import gulp from 'gulp';
import gutil from 'gulp-util';
import eslint from 'gulp-eslint';

import config from '../config';

// create a default task and just log a message
gulp.task('default', () => {
  return gutil.log('Gulp is running!');
});

gulp.task('lint-watch', () => {
  gulp.watch(config.js.src, ['lint:js']);
});

gulp.task('lint:js', () => {
  return gulp.src(config.js.src)
    .pipe(eslint({
      fix: true
    }))
    .pipe(eslint.format())
    .pipe(eslint.failAfterError())
    .pipe(eslint.result(function (result) {
      const {filePath, warningCount, errorCount} = result;
      const fileStatus = () => {
        if (warningCount + errorCount === 0) {
          return gutil.colors.green('GOOD');
        } else if (errorCount) {
          return gutil.colors.red('BAD ');
        } else if (warningCount) {
          return gutil.colors.yellow('WARN');
        }

        return 'NOSTAT';
      };

      gutil.log(fileStatus(), filePath);
    }));
});
