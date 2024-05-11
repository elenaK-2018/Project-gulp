import gulp from 'gulp';
import browserSync from 'browser-sync';
import sassPkg from 'sass';
import gulpSass from 'gulp-sass';
import gulpCssimport from 'gulp-cssimport';
import {deleteSync} from 'del';
import htmlmin from 'gulp-htmlmin';
import cleanCSS from 'gulp-clean-css';
import terser from 'gulp-terser';
import concat from 'gulp-concat';
import sourcemaps from 'gulp-sourcemaps';
import gulpImg from 'gulp-image';
import gulpWebp from 'gulp-webp';
// import gulpAvif from 'gulp-avif';
import { stream as critical } from 'critical';
import gulpIf from 'gulp-if';
import autoprefixer from 'gulp-autoprefixer';
import babel from 'gulp-babel';
import plumber from 'gulp-plumber';



const prepros = true;    // менять на false, если не используем препроцессор

let dev = false;      // усли true, то продакшн сборка

const sass = gulpSass(sassPkg);

const allJS = [
    "src/libs/jquery-3.7.1.min.js",
    "src/libs/swiper-element-bundle.min.js",
];

    // задачи 

export const html = () => gulp
    .src('src/*.html')
    .pipe(htmlmin({
        removeComments: true,
        collapseWhitespace: true,
    }))
    .pipe(gulp.dest('dist'))
    .pipe(browserSync.stream());

export const style = () => {
    if(prepros) {
        return gulp
            .src('src/scss/**/*.scss')
            .pipe(gulpIf(dev, sourcemaps.init())) 
            .pipe(sass().on('errors', sass.logError))
            .pipe(autoprefixer())
            .pipe(cleanCSS({
                2:  { specialComments: 0,
                }
            }))
            .pipe(gulpIf(dev, sourcemaps.write('../maps')))
            .pipe(gulp.dest('dist/css'))
            .pipe(browserSync.stream());    
    }

    return gulp
    .src('src/css/style.css')
    .pipe(gulpIf(dev, sourcemaps.init()))  
    .pipe(gulpCssimport({
        extensions: ['css'],
    }))
    .pipe(autoprefixer())    // по умолч. поддерживает две послед. версии браузера, но мы можем изменить в package.json
    .pipe(cleanCSS({
        2: { specialComments: 0,
        }
    }))
    .pipe(gulpIf(dev, sourcemaps.write('../maps')))
    .pipe(gulp.dest('dist/css'))
    .pipe(browserSync.stream());
} 

export const js = () => gulp
    .src([...allJS, 'src/js/**/*.js'])
    .pipe(plumber())
    .pipe(gulpIf(dev, sourcemaps.init()))
    .pipe(babel({
        presets: ['@babel/preset-env'],
        ignore: [...allJS, 'src/js/**/*.min.js']
    }))   
    .pipe(terser())
    .pipe(concat('index.min.js'))
    .pipe(gulpIf(dev, sourcemaps.write('../maps')))
    .pipe(gulp.dest('dist/js'))
    .pipe(browserSync.stream());


export const img = () => gulp
    .src('src/image/**/*.{jpg,jpeg,png,svg}')
    .pipe(gulpIf(!dev, gulpImg({
        optipng: ['-i 1', '-strip all', '-fix', '-o7', '-force'],
        pngquant: ['--speed=1', '--force', 256],
        zopflipng: ['-y', '--lossy_8bit', '--lossy_transparent'],
        jpegRecompress: ['--strip', '--quality', 'medium', '--min', 40, '--max', 80],
        mozjpeg: ['-optimize', '-progressive'],
        gifsicle: ['--optimize'],
        svgo: true,
    })))
    .pipe(gulp.dest('dist/image'))
    .pipe(browserSync.stream());


export const webp = () => gulp
    .src('src/image/**/*.{jpg,jpeg,png}')
    .pipe(gulpWebp({
        quality: 60
    }))
    .pipe(gulp.dest('dist/image'))
    .pipe(browserSync.stream({
        once: true
    }));

// export const avif = () => gulp
//     .src('src/image/**/*.{jpg,jpeg,png}')
//     .pipe(gulpAvif({
//         quality: 50
//     }))
//     .pipe(gulp.dest('dist/image'))
//     .pipe(browserSync.stream({
//         once: true
//     }));

export const critCSS = () => gulp
    .src('dist/*.html')
    .pipe(critical({
        base: 'dist/',
        inline: true,
        css: ['dist/css/style.css']
    }))
    .on('error', err => {
        console.error(err.massage)
    })
    .pipe(gulp.dest('dist'));

export const copy = () => gulp
    .src('src/fonts/**/*', {
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

    gulp.watch('./src/**/*.html', html);                                                                         //    "./" не обязательно в начале
    gulp.watch(prepros ? './src/scss/**/*.scss' : './src/css/**/*.css', style);
    gulp.watch('src/image/**/*.{jpg,jpeg,png,svg}', img);  
    gulp.watch('./src/js/**/*.js', js);  
    gulp.watch('./src/fonts/**/*', copy); 
    gulp.watch('src/image/**/*.{jpg,jpeg,png}', webp);  
    // gulp.watch('src/image/**/*.{jpg,jpeg,png}', avif);  
};

export const clear = (done) => {
    deleteSync(['dist/**/*'], {
        force: true,
    });
    done();
};

    // запуск 

export const develop = async() => {
    dev = true;
}

export const base = gulp.parallel(html, style, js, img, webp, copy);      //убрала avif

export const build = gulp.series(clear, base, critCSS);

export default gulp.series(develop, base, server);




