var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var batchSchema = new Schema({
	batchId			: {type:String,required:true},
	courseId		: {type:String,required:true},
	courseTitle		: {type:String},
	title			: {type:String,required:true},
	start			: {type:Date},
	end				: {type:Date},
	seats 			: {type:Number},
	fee 			: {type:Number},
	faculty 		: {type:String},
	details			: {type: String}, //details schema
	creationDate	: {type:Date,default:Date.now()},
	lastModified	: {type:Date,default:Date.now()},
	isDeleted 		: {type:Boolean,default:false}
});

mongoose.model('Batch', batchSchema, 'batch');
