var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var courseSchema = new Schema({
	courseId		: {type:String,required:true},
	title			: {type:String,required:true},
	details 		: {type:String},
//	tags 			: [String],
	creationDate	: {type:Date,default:Date.now()},
	lastModified	: {type:Date,default:Date.now()},
	isDeleted		: {type:Boolean,default:false}
});


mongoose.model('Course', courseSchema, 'course');