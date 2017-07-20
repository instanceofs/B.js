var
    B = require('./src/seed/B.seed.js'),
    gulp = require('gulp'),
    gulpLoadPlugins = require('gulp-load-plugins'),
    plugins = gulpLoadPlugins(),
    pkg = require('./package.json'),
    banner = ['/**',
        ' * 柏小白 ' + new Date()  + ' ',
        ' * @Version： v<%= pkg.version %>',
        ' * @Mail： <%= pkg.qq %>',
        ' * @Link： http://web.xn--w0sz4as21fs7k.com/',
        ' */',
        ''].join('\n'),
        PATH = {};

/* = 全局设置
 -------------------------------------------------------------- */
PATH.SRC = {
    SEED_SRC: ['src/seed/B.seed.js', 'src/seed/**/*.js', '!src/seed/**/*.min.js']
};


PATH.DEST = {
    SEED_SRC: 'build/js'
};

//seed
gulp.task("seed", function (){
    return gulp.src(PATH.SRC.SEED_SRC)
    //合并文件
        .pipe(plugins.concat("B.js"))
        // 重命名
        .pipe(plugins.rename({suffix: '.min'}))
        //压缩文件
        .pipe(plugins.uglify({preserveComments: 'some'}))
        // 备注
        .pipe(plugins.header(banner, {pkg: pkg}))
        // 存储
        .pipe(gulp.dest(PATH.DEST.SEED_SRC));

});


gulp.task('watch', function (){
    gulp.watch([PATH.SRC.SEED_SRC], ['seed']);
});
gulp.task('de', function (){
    return gulp.start('seed');
});

gulp.task('help', function (){
    console.log('gulp help			    gulp参数说明');
    console.log('----------------- 开发环境 -----------------');
    console.log('gulp seed			    JS压缩&重命名&检查');
    console.log('gulp watch			    JS动态监控');
    console.log('---------------- 发布环境 -----------------');
    console.log('gulp de			    测试打包');
});
