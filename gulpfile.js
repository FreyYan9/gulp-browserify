const gulp = require('gulp'),
    babel = require('gulp-babel'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    cssnano = require('gulp-cssnano'),
    concat = require('gulp-concat'),
    browserify = require('browserify'),
    source = require('vinyl-source-stream'),
    clean = require('gulp-clean');


gulp.task('js', function() {
    gulp.src('./js/jquery.js').pipe(gulp.dest('./dist/js/'))

    return gulp.src(['./js/**.js', '!./js/jquery.js'])
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(uglify())
        .pipe(gulp.dest('./dist/es'))
        .on('end', () => {
            gulp.run('browserify')
        });
})

gulp.task('css', () => {
    return gulp.src('./css/**.css')
        .pipe(concat('bundle.css'))
        .pipe(cssnano())
        .pipe(rename(path => {
            path.basename += '.min'
        }))
        .pipe(gulp.dest('dist/css'));
});

gulp.task("browserify", function() {
    var b = browserify({
            entries: "dist/es/imp.js"
        })
        .external(['dist/es/jquery.js']);

    return b.bundle()
        .pipe(source("bundle.js"))
        .pipe(gulp.dest("dist/js"))
        .on('end', () => {
            gulp.run('css')
        });
});

gulp.task('clean', () => {
    return gulp.src('./dist', { read: false })
        .pipe(clean())
        .on('end', () => {
            gulp.run('js')
        });
})