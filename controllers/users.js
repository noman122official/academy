var mongoose = require('mongoose');
var UserModel = mongoose.model('User');
var adminKey = "admin";
//to be done
module.exports.controller = function(app){

	app.get('/admin', function(req,res){

		UserModel.find({}, function(err,result){
			if(err){
				console.log(err);
				res.send({error:true,'errorMessage':err,'userMessage':'Sorry some error occured'});
			}
			else{
				res.render('admin', {users : result});
			}

		});
	});

	app.get('/users/view', function(req,res){

		UserModel.find({}, function(err,result){
			if(err){
				console.log(err);
				res.send({error:true,'errorMessage':err,'userMessage':'Sorry some error occured'});
			}
			else{
				res.send(result);
			}

		});
	});

	app.post('/users/create', auth, function(req,res){
		var newUser = new UserModel(
			{
				username : req.body.username,
				password : req.body.password,
				fullname : req.body.fullname
			});

		if(newUser.username=='' || newUser.password=='' || !newUser.username || !newUser.password ){
			res.send({error:true,'errorMessage':'Empty Username/password','userMessage':'Sorry some error occured'});
		}
		else {
			newUser.save(function(err){
				if(err){
					console.log(err);
					res.send({error:true,'errorMessage':err,'userMessage':'Sorry some error occured'});
				}
				else{
					console.log("User added : " + req.body.username);
					//res.send({success:true, 'userMessage':'User '+req.body.username+' added successfully'});
					res.redirect('/admin');
				}
			});
		}
	});

//no page to remove user. Function not allowed since it requires integrity check with existing blogs
	app.post('/users/remove', auth, function(req, res){
			UserModel.remove({'_id':req.body.id},function(err,user){

				if(err){
					console.log(err);
					res.send({error:true,'errorMessage':err,'userMessage':'Sorry some error occured'});
				}
				else{
					console.log("UserId removed : " + req.body.id);
					res.redirect("/admin");
				}
			});
		});

}