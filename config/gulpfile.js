const { join } = require('path');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const extReplace = require('gulp-ext-replace');
const gulp = require('gulp');
const postcss = require('gulp-postcss');
const replace = require('gulp-replace');
const sass = require('gulp-sass');

const rootPath = __dirname;
const srcPath = join(__dirname, '../src');
const distPath = join(__dirname, '../cc-src');

/**
 * Copy souce files to specified directory
 */
gulp.task('copy', function(done) {
  gulp
    .src([join(srcPath, 'bootstrap.ts'), join(srcPath, 'app/**/*')], {
      base: srcPath,
    })
    .pipe(gulp.dest(distPath))
    .on('end', done);
});

/**
 * Compile/add prefixes/minify sass
 * files and saves as css files
 */
gulp.task('sass', ['copy'], function(done) {
  gulp
    .src([join(distPath, 'app/**/*.component.scss')], { base: rootPath })
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss([autoprefixer(), cssnano()]))
    .pipe(extReplace('.css'))
    .pipe(gulp.dest(rootPath))
    .on('end', done);
});

/**
 * Replace .scss entries with .css in
 * angular components
 */
gulp.task('replace', ['sass'], function(done) {
  gulp
    .src([join(distPath, '**/*.component.ts')], { base: rootPath })
    .pipe(replace(/\.component\.scss/g, '.component.css'))
    .pipe(gulp.dest(rootPath))
    .on('end', done);
});

gulp.task('default', ['replace']);
