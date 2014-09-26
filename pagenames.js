var kde=require("ksana-document").kde;

var dumpPages=function(fn,idx) {
	var pagenames=this.getFilePageNames(idx);
	console.log(fn);
	console.log("   ",pagenames.join(" "));
}
	
kde.open("yinshun",function(db){
	var filenames=db.get("fileNames");
	filenames.map(dumpPages,db);
	
});
