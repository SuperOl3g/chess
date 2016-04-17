'use strict';

let gulp          = require('gulp'),
    seq           = require('run-sequence'),
    watch         = require('gulp-watch'),
    browserSync   = require('browser-sync').create(),
    clean         = require('gulp-clean'),
    rename        = require('gulp-rename'),
    notify        = require("gulp-notify"),
    plumber       = require('gulp-plumber'),

    sass          = require('gulp-sass'),
    sassGlob      = require('gulp-sass-glob'),
    cssimport     = require("gulp-cssimport"),
    autoprefixer  = require('gulp-autoprefixer'),

    imagemin      = require('gulp-imagemin'),
    svgstore      = require('gulp-svgstore'),

    webpack       = require("gulp-webpack"),
    webpackConfig = require("./webpack.config"),
    named         = require('vinyl-named');

const paths = {
  js:           'src/js/**/*.js',
  sass:         'src/css/**/*.scss',
  css:          'src/css/**/*.css',
  img:          'src/img/*',
  spriteSvg:    'src/sprite-svg/*.svg',
  html:         'src/*.html',
  templates:    'src/templates/*',
  favicons:     'src/favicons/*'
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

gulp.task('clean', () => {
  return gulp.src('dist/*', {read: false})
    .pipe( clean() );
});

gulp.task('build', (cb) => {
  seq('clean', ['js', 'sass', 'favicons' ,'html', 'img', 'sprite-svg'], cb);
});

gulp.task('watch', ['build'], () => {
  watch( paths.js,        () => { seq('js');         });
  watch( paths.templates, () => { seq('js');         });
  watch( paths.html,      () => { seq('html');       });
  watch( paths.favicons,  () => { seq('favicons');   });
  watch( paths.sass,      () => { seq('sass');       });
  watch( paths.img,       () => { seq('img');        });
  watch( paths.spriteSvg, () => { seq('sprite-svg'); });
});

gulp.task('html', () => {
  return gulp.src(paths.html)
    .pipe( gulp.dest('./dist') )
    .pipe( browserSync.stream() );
});

gulp.task('favicons', () => {
  return gulp.src(paths.favicons)
    .pipe( gulp.dest('./dist/favicons') )
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


gulp.task('js', () => {
  return gulp.src(['src/js/app.js'])
    .pipe(named())
    .pipe(plumber({ errorHandler: notify.onError( (error) => error.message)}))
    .pipe(webpack(webpackConfig))
    .pipe(plumber.stop())
    .pipe(gulp.dest('dist/js'))
    .pipe( browserSync.stream() );
});

gulp.task('sass', () => {
  return gulp.src('src/css/base.scss')
    .pipe( sassGlob() )
    .pipe( sass() )
    .pipe(cssimport({}))
    .on('error', notify.onError( (error) => error.message) )
    .pipe( autoprefixer() )
    .pipe(rename('style.css'))
    .pipe( gulp.dest('./dist/css') )
    .pipe( browserSync.stream() );
});
