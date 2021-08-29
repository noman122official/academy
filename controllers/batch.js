'use strict'

const mongoose = require('mongoose'); 
const shortid = require('shortid');
shortid.characters('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$@');

const userModel = mongoose.model('User');
const courseModel = mongoose.model('Course');
const batchModel = mongoose.model('Batch');

exports.all = (req,res,callback)=>{
	let searchParams = {};
	searchParams.isDeleted = false;
//	searchParams.status = 1;
	batchModel.find(searchParams, (err, batches)=>{
		if(err) {
			callback({'response':"Error getting batches.", 'res':false});
		}
		else {
			callback({ 'res' : true,
				'batches' : batches
			});
		}
	});
}

exports.getBatch = (req,res,callback)=>{
	let searchParams = {};
	searchParams.batchId = req.params.batchId;
//	searchParams.isDeleted = false;
//	searchParams.status = 1;
	batchModel.find(searchParams, (err, batches)=>{
		if(err) {
			callback({'response':"Error getting batch.", 'res':false});
		}
		else {
			if(batches.length == 0) {
				callback({'response':"Batch not found.", 'res':false});
			}
			else {
				let batch = batches[0];
				callback({ 'res' : true,
					'batch' : batch
				});
			}
		}
	});
}

exports.createBatch = (req,res,callback)=>{
	//courseId
	courseModel.find({'courseId':req.body.courseId,'isDeleted':false}, (err,courses)=>{
		if(err || courses.length == 0) {
			console.log("Course not found");
			callback({'response':"Error getting course.", 'res':false});
		}
		else {
			console.log(courses);
			let course = courses[0];
			let newBatch = new batchModel({
				batchId			: req.body.customeBatchId? req.body.customeBatchId: 'AHB-'+String(new Date().getFullYear()).substr(2,2)+'-'+shortid.generate(),
				title			: req.body.title,
				courseId		: course.courseId,
				courseTitle		: course.title,
				start			: req.body.start, //format October 13, 2014
				end				: req.body.end,
				seats			: req.body.seats,
				fee 			: req.body.fee,
				faculty 		: req.body.faculty,
				details			: req.body.details,
				creationDate	: new Date(),
				lastModified	: new Date(),
				isDeleted 		: false
			});

			newBatch.save((err)=>{
				if(err) {
					console.log("Error creating batch");
					callback({'response':"Error creating batch.", 'res':false});
				}
				else{
					console.log("New Batch Created: "+ newBatch.title);
					callback({'response':"Batch created successfully", 'res':true,
						'batch' : newBatch.toJSON()
					});
				}
			});
		}
	});	
	
}

exports.updateBatch = (req,res,callback)=>{
	batchModel.find({'batchId':req.params.batchId,'isDeleted':false}, (err,batch)=>{
		if(err || batch.length == 0) {
			console.log("Batch not found");
			callback({'response':"Error getting batch/Invalid batch id.", 'res':false});
		}
		else {
			batch = batch[0];
			if(req.body.title) batch.title = req.body.title;
			if(req.body.start) batch.start = req.body.start;
			if(req.body.end) batch.end = req.body.end;
			if(req.body.seats) batch.seats = req.body.seats;
			if(req.body.fee) batch.fee = req.body.fee;
			if(req.body.faculty) batch.faculty = req.body.faculty;
			if(req.body.details) batch.details = req.body.details;
			batch.lastModified = new Date();

//if validation fails, render page with data
			batch.save((err)=>{
				if(err) {
					console.log("Error updating batch");
					callback({'response':"Error updating batch.", 'res':false});
				}
				else{
					console.log("Batch updated: "+ batch.title);
					callback({'response':"Batch updated successfully", 'res':true,
						'batch' : batch.toJSON()
					});
				}
			});
		}
	});	
	
}


///////////////////Courses
exports.courseall = (req,res,callback)=>{
	let searchParams = {};
	searchParams.isDeleted = false;
//	searchParams.status = 1;
	courseModel.find(searchParams, (err, courses)=>{
		if(err) {
			callback({'response':"Error getting courses.", 'res':false});
		}
		else {
			callback({ 'res' : true,
				'courses' : courses
			});
		}
	});
}

exports.getCourse = (req,res,callback)=>{
	let searchParams = {};
	searchParams.courseId = req.params.courseId;
//	searchParams.isDeleted = false;
//	searchParams.status = 1;
	courseModel.find(searchParams, (err, courses)=>{
		if(err) {
			callback({'response':"Error getting course.", 'res':false});
		}
		else {
			if(courses.length == 0) {
				callback({'response':"Course not found.", 'res':false});
			}
			else {
				let course = courses[0];
				callback({ 'res' : true,
					'course' : course
				});
			}
		}
	});
}

exports.createCourse = (req,res,callback)=> {
	let newCourse = new courseModel({
		courseId		: req.body.customCourseId ? req.body.customCourseId : 'AHC-'+String(new Date().getFullYear()).substr(2,2)+'-'+shortid.generate(),
		title			: req.body.title,
		details			: req.body.details,
		creationDate	: new Date(),
		lastModified	: new Date(),
		isDeleted 		: false
	});

	newCourse.save((err)=> {
		if(err) {
			console.log("Error creating course");
			callback({'response':"Error creating course.", 'res':false});
		}
		else{
			console.log("New Course Created: "+ newCourse.title);
			callback({'response':"Course created successfully", 'res':true,
				'batch' : newCourse.toJSON()
			});
		}
	});
}

exports.updateCourse = (req,res,callback)=>{
	courseModel.find({'courseId':req.params.courseId,'isDeleted':false}, (err,course)=>{
		if(err || course.length == 0) {
			console.log("Course not found");
			callback({'response':"Error getting course/Invalid course id.", 'res':false});
		}
		else {
			course = course[0];
			if(req.body.title) course.title = req.body.title;
			if(req.body.details) course.details = req.body.details;
			course.lastModified = new Date();

//if validation fails, render page with data
			course.save((err)=>{
				if(err) {
					console.log("Error updating course");
					callback({'response':"Error updating course.", 'res':false});
				}
				else{
					console.log("Course updated: "+ course.title);
					callback({'response':"Course updated successfully", 'res':true,
						'course' : course.toJSON()
					});
				}
			});
		}
	});	
	
}
