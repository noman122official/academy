var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var studentSchema = new Schema({
	ahId 				: {type:String,required:true}, //unique:true
	name				: {type:String,default:'',required:true},
	contact				: {type:String,default:''},
	email				: {type:String,default:''},
	profession 			: {type:String},
	college				: {type:String,default:''},
	collegeDetails 		: {
		branch 				: {type:String},
		graduationYear		: {type:Number},
		city 				: {type:String}
	},
	company		 		: {type:String},
	companyDetails 		: {
		position 			: {type:String},
		city 				: {type:String}
	},
	address 			: {type:String},
	city				: {type:String},
	pincode 			: {type:Number},
	idProofType 		: {type:String},
	idProofNo			: {type:String},
	fatherName			: {type:String},
	//courses				: [String],	//array of courses id
	//batches				: [String], //array of batches id
	remarks				: {type:String,default:''},
	creationDate 		: {type:Date,default:Date.now()},
	lastModified 		: {type:Date,default:Date.now()},
	modifiedBy			: {type:String,default:''},
	isDeleted			: {type:Boolean, default:false}
});

mongoose.model('Student', studentSchema, 'student');
