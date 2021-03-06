var gulp = require('gulp'),
    pjson = require('./package.json'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    cleanCSS = require('gulp-clean-css'),
    rename = require('gulp-rename'),
    del = require('del'),
    plumber = require('gulp-plumber'),
    uglify = require('gulp-uglify'),
    babel = require('gulp-babel'),
    concat = require('gulp-concat'),
    imagemin = require('gulp-imagemin'),
    exec = require('child_process').exec,
    browserSync = require('browser-sync').create(),
    reload = browserSync.reload;

var base = './assets/src',
    paths = {
        css: base + '/css/**/*.css',
        sass: base + '/scss/**/*.scss',
        images: base + '/img/**/*',
        js: base + '/js/**/*.js',
        vue: base + '/app/**/*.js',
        templates: './**/templates/**/*.html',
        dist: './assets/dist',
        app: './',
    };

function styles() {
    return gulp.src(paths.sass)
        .pipe(sass({
            outputStyle: "compressed",
            precision: 8,
            includePaths: ['node_modules/bootstrap/scss'],
        }).on('error', sass.logError))
        .pipe(plumber()) // Checks for errors
        .pipe(autoprefixer({ browsers: ['last 2 version'] })) // Adds vendor prefixes
        .pipe(gulp.dest(paths.dist + '/css'))
        .pipe(rename({ suffix: '.min' }))
        .pipe(cleanCSS()) // Minifies the result
        .pipe(gulp.dest(paths.dist + '/css'));
}

function scripts() {
    return gulp.src([
        './node_modules/jquery/dist/jquery.js',
        './node_modules/popper.js/dist/umd/popper.js',
        './node_modules/bootstrap/dist/js/bootstrap.js',
        './node_modules/jsrender/jsrender.js',
        './node_modules/holderjs/holder.js',
        paths.js])
        .pipe(plumber()) // Checks for errors
        .pipe(concat("legacy.js"))
        // .pipe(uglify()) // Minifies the js
        // .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest(paths.dist + '/js'));
}

function vueify() {
    return gulp.src(paths.vue)
        .pipe(plumber()) // Checks for errors
        .pipe(babel({
            presets: ['@babel/preset-env']
        }))
        // .pipe(uglify()) // Minifies the js
        // .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest(paths.dist + '/js'));
}



function imgCompression() {
    return gulp.src(paths.images)
        .pipe(imagemin()) // Compresses PNG, JPEG, GIF and SVG images
        .pipe(gulp.dest(paths.dist + '/img'))
}

function runServer() {
    exec('python manage.py runserver', function (err, stdout, stderr) {
        console.log(stdout);
        console.log(stderr);
    });
}

function browSync() {
    browserSync.init(
        [paths.css, paths.js, paths.templates], {
            proxy: "localhost:8000"
        });
}

function watch() {
    gulp.watch(paths.sass, styles);
    gulp.watch(paths.js, scripts).on("change", reload);
    gulp.watch(paths.images, imgCompression);
    gulp.watch(paths.templates).on("change", reload);
}

function clean() {
    return del([paths.dist])
}

var build = gulp.parallel(styles, scripts, vueify)
var defaultTask = gulp.series(build, runServer, browSync)

exports.build = build
exports.clean = clean
exports.runserv = runServer
exports.browsync = browSync
exports.default = defaultTask
exports.imgcomp = imgCompression
exports.scripts = scripts
exports.vueify = vueify
exports.styles = styles
exports.watch = gulp.series(defaultTask, watch)
