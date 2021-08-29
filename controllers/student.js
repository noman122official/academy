'use strict'


const mongoose = require('mongoose'); 
const async = require('async');
const shortid = require('shortid');
shortid.characters('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$@');

const studentModel = mongoose.model('Student');
const userModel = mongoose.model('User');
const courseModel = mongoose.model('Course');
const batchModel = mongoose.model('Batch');
const batchPayModel = mongoose.model('BatchPay');

exports.all = (req,res,callback)=>{
	let searchParams = {};
//	searchParams.status = 1;
	studentModel.find(searchParams, (err, students)=>{
		if(err) {
			callback({'response':"Error getting students.", 'res':false});
		}
		else {
			callback({ 'res' : true,
				'students' : students
			});
		}
	});
}

exports.getStudent = (req,res,callback)=>{
	let searchParams = {};
	searchParams.ahId = req.params.ahId;
	console.log(req.params.ahId);
//	searchParams.status = 1;
	studentModel.find(searchParams, (err, students)=>{
		if(err) {
			callback({'response':"Error getting students.", 'res':false});
		}
		else {
			if(students.length == 0) {
				callback({'response':"Student not found.", 'res':false});
			}
			else {
				let student = students[0];
				async.parallel({
					batches	:(callback)=>{
								batchPayModel.find({'studentId':req.params.ahId},(err,batches)=>{
									if(!err){
										callback(null,batches);
									}
									else{
										callback(err,[]);
									}
								});
							},
					},
					(err,results)=>{
						if(err) {
							console.log(err);
							callback({'response':"Error getting students.", 'res':false});
						}
						console.log(results);
						callback({ 'res' : true,
							'batches' : results.batches,
							'courses' : results.courses,
							'student' : student
						}); 
					}
				);				
			}
		}
	});
}

exports.createStudent = (req,res,callback)=>{

	let newStudent = new studentModel({
		ahId 				: req.body.customStudentId?req.body.customStudentId: 'AH-'+String(new Date().getFullYear()).substr(2,2)+'-'+shortid.generate(),
		name				: req.body.name,
		contact				: req.body.contact,
		email				: req.body.email,
		profession			: req.body.profession,
		college				: req.body.college,
		collegeDetails		: {
			branch 				: req.body.branch,
			graduationYear		: req.body.graduationYear,
			city 				: req.body.collegeCity
							},
		company				: req.body.company,
		//some details left
		address				: req.body.address,
		city				: req.body.city,
		pincode				: req.body.pincode,
		idProofType			: req.body.idProofType,
		idProofNo			: req.body.idProofNo,
		fatherName			: req.body.fatherName,
		remarks				: req.body.remarks,
		creationDate 		: new Date(),
		lastModified 		: new Date(),
		modifiedBy			: "noAdmin",	//edit after creating profile
		isDeleted			: false
	});
	//College office etc to be added
	newStudent.save((err)=>{
		if(err) {
			console.log("Error creating student");
			callback({'response':"Error getting students.", 'res':false});
		}
		else{
			console.log("New Student Registered: "+ newStudent.name);
			callback({'response':"Student registered successfully", 'res':true,
				'student' : newStudent.toJSON()
			});
		}
	});
}

exports.updateStudent = (req,res,callback)=>{

	studentModel.find({'ahId': req.params.studentId, 'isDeleted': false}, (err, student)=>{
		if(err || student.length == 0) {
			callback({'response':"Error getting student/Invalid student id.", 'res':false});
		}
		else {
			student = student[0];
			if(req.body.name) student.name = req.body.name;
			if(req.body.contact) student.contact = req.body.contact;
			if(req.body.email) student.email = req.body.email;
			if(req.body.profession) student.profession = req.body.profession;
			if(req.body.college) student.college = req.body.college;
			if(req.body.branch) student.collegeDetails.branch = req.body.branch;
			if(req.body.graduationYear) student.collegeDetails.graduationYear = req.body.graduationYear;
			if(req.body.collegeCity) student.collegeDetails.city = req.body.collegeCity;
			if(req.body.company) student.company = req.body.company;
			if(req.body.address) student.address = req.body.address;
			if(req.body.city) student.city = req.body.city;
			if(req.body.pincode) student.pincode = req.body.pincode;
			if(req.body.idProofType) student.idProofType = req.body.idProofType;
			if(req.body.idProofNo) student.idProofNo = req.body.idProofNo;
			if(req.body.fatherName) student.fatherName = req.body.fatherName;
			if(req.body.remarks) student.remarks = req.body.remarks;
			student.modifiedBy = "noAdmin";
			student.lastModified = new Date();
			student.save((err)=>{
				if(err) {
					console.log("Error saving student");
					callback({'response':"Error saving student.", 'res':false});
				}
				else{
					console.log("Student updated: "+ student.name);
					callback({'response':"Student updated successfully", 'res':true,
						'student' : student.toJSON()
					});
				}
			});
		}
	});
}


exports.addStudentToBatch = (req,res,callback)=>{
	
	//batchid studentid details

	studentModel.find({'ahId': req.body.studentId, 'isDeleted': false}, (err, students)=>{
		if(err) {
			callback({'response':"Error getting student.", 'res':false});
		}
		else {
			if(students.length == 0) {
				callback({'response':"Invalid student ID.", 'res':false});
			}
			else {
				let student = students[0];
				batchModel.find({'batchId': req.body.batchId, 'isDeleted': false}, (err,batches)=>{
					if(err || batches.length == 0) {
						callback({'response':"Invalid batch ID.", 'res':false});
					}
					else {
						let batchPayment = new batchPayModel({
							courseId	: batches[0].courseId,
							courseTitle : batches[0].courseTitle,
							batchId		: req.body.batchId,
							batchTitle	: batches[0].title,
							studentId	: req.body.studentId,
							start		: req.body.startDate?req.body.startDate:batches[0].start,
							end			: req.body.endDate?req.body.endDate:batches[0].end,
							totalPaid	: 0,
							amount		: req.body.amount ? req.body.amount:batches[0].fee,
							details 	: req.body.details
						});
						batchPayment.save((err)=>{
							if(err) {
								console.log("Error adding student to batch");
								callback({'response':"Error saving student data.", 'res':false});
							}
							else {
								console.log("Student added to batch "+ student.name);
								callback({'response':"Student added to batch successfully", 'res':true,
									'student' : student.toJSON(),
									'batchData' : batchPayment.toJSON()
								});
							}
						});
					}
				});
			}
		}
	});
}

exports.payment =(req,res,callback)=> {
	batchPayModel.find({'studentId':req.body.studentId, 'batchId':req.body.batchId},(err,batchPay)=>{
		if(err || batchPay.length == 0) {
			console.log("Error accepting payment details");
			callback({'response':"Error accepting payment or student not registered.", 'res':false});				
		}
		else{
			batchPay = batchPay[0];
			let paymentData = {
				ahPaymentId : shortid.generate(),
				ahReceiptNo : req.body.receiptno,
				method		: req.body.method,
				amountPaid	: req.body.amountPaid,
				details 	: req.body.details,
				paymentDate : req.body.paymentDate,
				creationDate: new Date(),
				isDeleted	: false
			};
			batchPay.paymentDetails.push(paymentData);
			batchPay.save((err)=>{
				if(err){
					console.log("Error saving payment details");
					callback({'response':"Error accepting payment.", 'res':false});
				}
				else {
					callback({"response":"Payment details saved successfully.", "res":true,
						"paymentData" : batchPay.toJSON()
					});
				}
			});
		}
	});
}

exports.showPayments =(req,res,callback)=> {
	batchPayModel.find({'studentId':req.query.studentId, 'batchId':req.query.batchId},(err,batchPay)=>{
		if(err || batchPay.length == 0) {
			console.log("Error getting registration details/ Invalid batch or student ID");
			callback({'response':"Error getting registration details/ Invalid batch or student ID.", 'res':false});				
		}
		else{
			batchPay = batchPay[0];
			callback({"response":"Details retreived.", "res":true,
						"paymentData" : batchPay.toJSON()
			});
		}
	});
}
