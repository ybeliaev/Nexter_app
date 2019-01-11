    var gulp        = require('gulp'), // Подключаем Gulp
    	browserSync = require('browser-sync').create();
        sass        = require('gulp-sass'), //Подключаем Sass пакет
        concat      = require('gulp-concat'),// Подключаем gulp-concat (для конкатенации файлов)
        cssnano     = require('gulp-cssnano'), // Подключаем пакет для минификации CSS
        rename      = require('gulp-rename'), // Подключаем библиотеку для переименования файлов
        clean       = require('gulp-clean'), // Подключаем библиотеку для удаления файлов и папок
        imagemin    = require('gulp-imagemin'), //Подключаем библиотеку для работы с изображениями
        autoprefixer = require('gulp-autoprefixer');// Подключаем библиотеку для автоматического добавления префиксов

        
    //gulp-sass
    gulp.task('sass', function(){ // Создаем таск "sass"
        return gulp.src('app/sass/*.sass') // Берем источник
            .pipe(sass()) // Преобразуем Sass в CSS посредством gulp-sass
            .pipe(autoprefixer(['last 2 versions'], { cascade: true })) // Создаем префиксы
            .pipe(gulp.dest('app/css')) // Выгружаем результата в папку app/css
            .pipe(browserSync.reload({stream:true}));
    });
    //gulp-concat
    gulp.task('scripts', function() {
          return gulp.src([ // Берем все необходимые библиотеки
                'app/libs/jquery/dist/jquery.min.js', // Берем jQuery
                'app/libs/magnific-popup/dist/jquery.magnific-popup.min.js' // Берем Magnific Popup
        ])
        .pipe(concat('main.js'))
        .pipe(gulp.dest('app/js'));
    });
    //minification
    gulp.task('cssnano', function() {
    return gulp.src('app/css/libs.css')// в libs.css @import
        .pipe(cssnano()) // Сжимаем
        .pipe(rename({suffix: '.min'})) // Добавляем суффикс .min
        .pipe(gulp.dest('app/css')); // Выгружаем в папку app/css

});

    // Static server
	gulp.task('browser-sync', function() {
	    browserSync.init({
	        server: {
	            baseDir: "app"
	        }
	    });
	});
    // del
    gulp.task('clean', function () {
    return gulp.src('dist/', {read: false})
        .pipe(clean());
});
    gulp.task('watch',['browser-sync', 'sass', 'scripts','cssnano'], function() {
        gulp.watch('app/sass/**/*.sass', ['sass']); // Наблюдение за sass файлами
        gulp.watch('app/*.html', browserSync.reload); // Наблюдение за HTML файлами в корне проекта
        gulp.watch('app/js/**/*.js', browserSync.reload); // Наблюдение за JS файлами в папке js

        
    });

    gulp.task('img', function() {
    return gulp.src('app/img/**/*') // Берем все изображения из app
        .pipe(imagemin()) // Сжимаем их с наилучшими настройками
        .pipe(gulp.dest('dist/img')); // Выгружаем на продакшен
});
    gulp.task('build', ['clean','img', 'sass', 'scripts'], function() {

        var buildCss = gulp.src([ // Переносим CSS стили в продакшен
            'app/css/main.css',
            'app/css/libs.min.css'
            ])
        .pipe(gulp.dest('dist/css'))

        var buildFonts = gulp.src('app/fonts/**/*') // Переносим шрифты в продакшен
        .pipe(gulp.dest('dist/fonts'))

        var buildJs = gulp.src('app/js/**/*') // Переносим скрипты в продакшен
        .pipe(gulp.dest('dist/js'))

        var buildHtml = gulp.src('app/*.html') // Переносим HTML в продакшен
        .pipe(gulp.dest('dist'));

    });
    gulp.task('default', ['watch']);//чтобы не писать в консоли постоянно gulp watch, а писать просто gulp.


