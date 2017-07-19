var gulp = require('gulp'),
    gulpLoadPlugins = require('gulp-load-plugins'),
    plugins = gulpLoadPlugins(),
    pkg = require('./package.json'),
    banner = ['/**',
        ' ' + new Date() + ' ',
        ' * @version： v<%= pkg.version %>',
        ' * @link： http://web.xn--w0sz4as21fs7k.com/',
        ' */',
        ''].join('\n'),
    PATH = {};


/* = 全局设置
 -------------------------------------------------------------- */
PATH.SRC = {
    JS: ['src/sedd/**/*.js', '!src/sedd/**/*.min.js']
};
PATH.DEST = {
    JS: 'build/js'
};

//seed
gulp.task("seed", function () {
    return gulp.src(PATH.SRC.JS)
        //合并文件
        .pipe(plugins.concat("B.js"))
        //压缩文件
        .pipe(plugins.uglify({preserveComments: 'some'}))
        // 重命名
        .pipe(plugins.rename({suffix: '.min'}))
        // 备注
        .pipe(plugins.header(banner, {pkg: pkg}))
        // 存储
        .pipe(gulp.dest(PATH.DEST.JS+'/base'));

});




gulp.task('watch', function (){
    gulp.watch([PATH.SRC.JS], ['seed']);
});
gulp.task('de', function (){
    return gulp.start ('js');
});

gulp.task('help', function (){
    console.log('gulp help			    gulp参数说明');
    console.log('----------------- 开发环境 -----------------');
    console.log('gulp js			    JS压缩&重命名&检查');
    console.log('gulp watch			    JS动态监控');
    console.log('---------------- 发布环境 -----------------');
    console.log('gulp de			    测试打包');
});
