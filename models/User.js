const mongoose = require('mongoose');
const bcrypt   = require('bcrypt-nodejs');
const Schema = mongoose.Schema;
var userSchema = new Schema({
	username 	: {type:String},
	email		: {type:String,unique:true,required:true},
	password 	: {type:String,default:'',required:true},
	fullname 	: {type:String,default:'',required:true},
	isAdmin 	: {type:Boolean,default:false},
	activated 	: {type:Boolean,default:false},
	isDeleted 	: {type:Boolean,default:false},
	created 	: {type:Date},
	lastLogin	: {type:Date}
});

// methods ======================
// generating a hash
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

mongoose.model('User', userSchema, 'users');
