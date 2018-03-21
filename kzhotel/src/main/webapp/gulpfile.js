var gulp = require('gulp');
var uglify = require('gulp-uglify');//压缩js
var concat = require('gulp-concat');//合并
var pump = require('pump');//执行任务报错输出详细错误信息
var babel = require('gulp-babel');//es6->es5

var less = require('gulp-less');//编译less
var cssmin = require('gulp-cssmin');//压缩css
var autoprefixer = require('gulp-autoprefixer');//css自动添加浏览器前缀
var rev = require('gulp-rev');//添加版本号

var revCollector = require('gulp-rev-collector');//html中新文件名替换旧文件名

gulp.task('js', function(cb){
	pump([
			gulp.src('./js/client/*.js'),
				//.pipe(concat('all.js'))
				babel({presets: ['es2015']}),
				uglify(),
				rev(),//添加版本号
				gulp.dest('./js/revclient'),//-->加版本号后的js文件
				rev.manifest(),
				gulp.dest('./js/revjson'),//-->新旧JS文件对应的json文件
		],
		cb
	);
});

/*gulp.task('less', function(){
	gulp.src('./WebContent/less/*.less')
		.pipe(less())
		.pipe(cssmin())
		.pipe(autoprefixer())//css自动添加浏览器前缀
		.pipe(rev())//添加版本号
		.pipe(gulp.dest('./WebContent/css/'))
		.pipe(rev.manifest())
		.pipe(gulp.dest('./WebContent/css/'));
});*/

gulp.task('jsrev', function(){
	gulp.src(['./js/revjson/*.json', './client/*.jsp'], {base: './client'})
		.pipe(revCollector())
		.pipe(gulp.dest('./revclient'));
});