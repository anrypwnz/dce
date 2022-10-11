const gulp = require('gulp');
const del = require('del');
const autoprefixer = require('gulp-autoprefixer');
const browserSync = require('browser-sync');
const pug = require('gulp-pug');
const sass = require('gulp-sass')(require('sass'));
const concat = require("gulp-concat");
const rename = require("gulp-rename");
const imagemin = require('gulp-imagemin');
const plumber = require('gulp-plumber');

var paths = {
  dirs: {
    build: './build'
  },
  html: {
    src: './src/pages/*.pug',
    dest: './build',
    watch: ['./src/pages/*.pug', './src/templates/*.pug', './src/blocks/**/*.pug']
  },
  css: {
    src: './src/styles/style.scss',
    dest: './build/css',
    watch: ['./src/blocks/**/*.scss', './src/styles/**/*.scss', './src/styles/*.scss']
  },
  js: {
    src: ['./node_modules/jquery/dist/jquery.min.js', './src/plugins/*.js', './src/blocks/**/*.js'],
    dest: './build/js',
    watch: './src/blocks/**/*.js',
    watchPlugins: './src/scripts/plugins/*.js'
  },
  images: {
    src: './src/blocks/**/img/*',
    dest: './build/img',
    watch: ['./src/blocks/**/img/*']
  },
  fonts: {
    src: './src/fonts/*',
    dest: './build/fonts',
    watch: './src/fonts/*'
  },
  favicon: {
    src: './src/favicon/**',
    dest: './build',
    watch: './src/favicon/**'
  }
};

gulp.task('clean', function () {
  return del(paths.dirs.build);
});

gulp.task('templates', function () {
  return gulp.src(paths.html.src)
    .pipe(plumber())
    .pipe(pug({
      pretty: true
    }))
    .pipe(gulp.dest(paths.html.dest))
    .pipe(browserSync.reload({
      stream: true
    }));
});

gulp.task('styles', function () {
  return gulp.src(paths.css.src)
    .pipe(plumber())
    .pipe(sass())
    .pipe(autoprefixer({
      browsers: ['last 20 versions']
    }))
    .pipe(gulp.dest(paths.css.dest))
    .pipe(browserSync.reload({
      stream: true
    }));
});

gulp.task('scripts', function () {
  return gulp.src(paths.js.src)
    .pipe(plumber())
    .pipe(concat('scripts.js'))
    .pipe(gulp.dest(paths.js.dest));
});

gulp.task('images', function () {
  return gulp.src(paths.images.src)
    .pipe(plumber())
    .pipe(imagemin())
    .pipe(rename({
      dirname: ''
    }))
    .pipe(gulp.dest(paths.images.dest));
});

gulp.task('fonts', function () {
  return gulp.src(paths.fonts.src)
    .pipe(plumber())
    .pipe(gulp.dest(paths.fonts.dest))
    .pipe(browserSync.reload({
      stream: true
    }));
});

gulp.task('favicon', function () {
  return gulp.src(paths.favicon.src)
    .pipe(plumber())
    .pipe(gulp.dest(paths.favicon.dest))
    .pipe(browserSync.reload({
      stream: true
    }));
});

gulp.task('server', function () {
  browserSync.init({
    server: {
      baseDir: paths.dirs.build
    },
    reloadOnRestart: true,
    tunnel: 'remote'
  });
  gulp.watch(paths.html.watch, gulp.parallel('templates'));
  gulp.watch(paths.css.watch, gulp.parallel('styles'));
  gulp.watch(paths.js.watch, gulp.parallel('scripts'));
  gulp.watch(paths.js.watchPlugins, gulp.parallel('scripts'));
  gulp.watch(paths.images.watch, gulp.parallel('images'));
  gulp.watch(paths.fonts.watch, gulp.parallel('fonts'));
  gulp.watch(paths.fonts.watch, gulp.parallel('favicon'));
});


gulp.task('build', gulp.series(
  'clean',
  'templates',
  'styles',
  'scripts',
  'images',
  'fonts',
  'favicon'
));

gulp.task('dev', gulp.series(
  'build', 'server'
));