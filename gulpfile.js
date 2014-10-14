var gulp=require('../gulpfile-app.js');

var spawn=require('child_process').spawn;
gulp.afterbuild=function() {
	var adbcommand="push build.js /sdcard/ksanagap/home/";
	console.log("adb "+adbcommand);
	var command=spawn("adb",adbcommand.split(" "));
	command.stderr.pipe(process.stdout);
	command.stdout.pipe(process.stdout);
}