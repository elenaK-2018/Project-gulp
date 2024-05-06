import gulp from 'gulp';
import browserSync from 'browser-sync';
import sassPkg from 'sass';
import gulpSass from 'gulp-sass';
import gulpCssimport from 'gulp-cssimport';
import {deleteSync} from 'del';

const prepros = true;    // менять на false

const sass = gulpSass(sassPkg);

    // задачи 

export const html = () => gulp
    .src('src/*.html')
    .pipe(gulp.dest('dist'))
    .pipe(browserSync.stream());

export const style = () => {
    if(prepros) {
        return gulp
            .src('src/scss/**/*.scss')
            .pipe(sass().on('errors', sass.logError))
            .pipe(gulp.dest('dist/css'))
            .pipe(browserSync.stream());    
    }

    return gulp
    .src('src/css/style.css')
    .pipe(gulpCssimport({
        extensions: ['css'],
    }))
    .pipe(gulp.dest('dist/css'))
    .pipe(browserSync.stream());
} 

export const js = () => gulp
    .src('src/js/**/*.js')
    .pipe(gulp.dest('dist/js'))
    .pipe(browserSync.stream());

export const copy = () => gulp
    .src([
        'src/fonts/**/*',
        'src/image/**/*'
    ], {
        base: 'src'
    })
    .pipe(gulp.dest('dist'))
    .pipe(browserSync.stream({
        once: true
    }));

export const server = () => {
    browserSync.init({
        ui: false,
        notify: false,
        // tunnel: true,
        server: {
            baseDir: 'dist'
        }
    });  

    gulp.watch('./src/**/*.html', html);
    gulp.watch(prepros ? './src/scss/**/*.scss' : './src/css/**/*.css', style);
    gulp.watch('./src/js/**/*.js', js);  
    gulp.watch([
        './src/image/**/*',
        './src/fonts/**/*'
    ], copy);   
};

export const clear = (done) => {
    deleteSync(['dist/**/*'], {
        force: true,
    });
    done();
};

    // запуск 

export const base = gulp.parallel(html, style, js, copy);

export const build = gulp.series(clear, base);

export default gulp.series( base, server);




