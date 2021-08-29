var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var batchPaymentsSchema = new Schema({
	ahPaymentId		: {type:String,required:true},
	ahReceiptNo 	: {type:String},
	method			: {type:String},
	amountPaid 		: {type:Number, required:true, default:0},
	details 		: {type:String},
	paymentDate		: {type:Date,default:Date.now()},
	creationDate	: {type:Date,default:Date.now()},
	isDeleted 		: {type:Boolean,default:false},
});
//studentId+batchId unique
var batchPaySchema = new Schema({
	courseId		: {type:String,required:true},
	courseTitle 	: {type:String},
	batchId			: {type:String,required:true},
	batchTitle 		: {type:String},
	start			: {type:Date},
	end				: {type:Date},
	studentId		: {type:String,required:true},
	paymentDetails  : [batchPaymentsSchema],
	totalPaid 		: {type:Number, default:0},	//tobedone
	amount			: {type:Number, default:0},
	details			: {type: String}, 
	creationDate	: {type:Date,default:Date.now()},
	lastModified	: {type:Date,default:Date.now()},
	isDeleted 		: {type:Boolean,default:false}
});
batchPaySchema.pre('save',function(next){
	this.totalPaid = 0;
	for(let i=0; i<this.paymentDetails.length; i++)
	{
		this.totalPaid = this.totalPaid + this.paymentDetails[i].amountPaid;
	}
	next();
});

mongoose.model('BatchPay', batchPaySchema, 'batchpay');
