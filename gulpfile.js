'use strict';

let gulp          = require('gulp'),
    seq           = require('run-sequence'),
    watch         = require('gulp-watch'),
    browserSync   = require('browser-sync').create(),
    rimraf        = require('rimraf'),
    rename        = require('gulp-rename'),
    notify        = require("gulp-notify"),

    sass          = require('gulp-sass'),
    sassGlob      = require('gulp-sass-glob'),
    autoprefixer  = require('gulp-autoprefixer'),

    imagemin      = require('gulp-imagemin'),
    svgstore      = require('gulp-svgstore'),

    browserify    = require('browserify'),
    babelify      = require('babelify'),
    source        = require('vinyl-source-stream');


const paths = {
  js:           'src/js/**/*.js',
  sass:         'src/css/**/*.scss',
  css:          'src/css/**/*.css',
  img:          'src/img/*',
  spriteSvg:    'src/sprite-svg/*.svg',
  html:         'src/**/*.html',
};

gulp.task('default', (cb) => {
  seq('watch', 'browserSync', cb);
});

gulp.task('browserSync', () => {
  browserSync.init({
    server: { baseDir: 'dist'},
    ghostMode: false
  });
});

gulp.task('clean', (cb) => {
  rimraf('dist', cb);
});

gulp.task('build', (cb) => {
  seq('clean', ['js', 'sass', 'css' ,'html', 'img', 'sprite-svg'], cb);
});

gulp.task('watch', ['build'], () => {
  watch( paths.js,        () => { seq('js');         });
  watch( paths.html,      () => { seq('html');       });
  watch( paths.sass,      () => { seq('sass');       });
  watch( paths.css,       () => { seq('css');        });
  watch( paths.img,       () => { seq('img');        });
  watch( paths.spriteSvg, () => { seq('sprite-svg'); });
});

gulp.task('html', () => {
  return gulp.src(paths.html)
    .pipe( gulp.dest('./dist') )
    .pipe( browserSync.stream() );
});

gulp.task('img', () => {
  return gulp.src(paths.img)
    .pipe( imagemin({
      optimizationLevel: 2,
      progressive: true,
      interlaced: true,
      multipass: true
    }))
    .pipe( gulp.dest('./dist/img') )
    .pipe( browserSync.stream() );
});

gulp.task('sprite-svg', () => {
  // return gulp.src( paths.spriteSvg )
  //   .pipe( svgstore() )
  //   .pipe( imagemin({ multipass: true }) )
  //   .pipe( rename('sprite.svg') )
  //   .pipe( gulp.dest('./dist/img') )
  //   .pipe( browserSync.stream() );
  return gulp.src(paths.spriteSvg)
      .pipe( imagemin({
        optimizationLevel: 2,
        progressive: true,
        interlaced: true,
        multipass: true
      }))
      .pipe( gulp.dest('./dist/img') )
      .pipe( browserSync.stream() );
});

gulp.task('css', () => {
  return gulp.src(paths.css)
    .pipe( gulp.dest('./dist/css') )
    .pipe( browserSync.stream() );
});

gulp.task('js', () => {
  return browserify('src/js/app.js')
    .transform(babelify, {presets: ["es2015"]})
    .bundle()
    .on('error', notify.onError( (error) => error.message) )
    .pipe(source('bundle.js') )
    .pipe( gulp.dest('./dist/js') )
    .pipe( browserSync.stream() );
});

gulp.task('sass', () => {
  return gulp.src('src/css/base.scss')
    .pipe( sassGlob() )
    .pipe( sass() )
    .on('error', notify.onError( (error) => error.message) )
    .pipe( autoprefixer() )
    .pipe(rename('style.css'))
    .pipe( gulp.dest('./dist/css') )
    .pipe( browserSync.stream() );
});
