'use strict';

const student = require('./controllers/student');
//const user = require('./controllers/user');
const batch = require('./controllers/batch');

// route middleware to ensure user is logged in

function isLoggedIn(req, res, next) {
  //console.log('auth: ' + req.isAuthenticated());
  if (req.isAuthenticated())
    return next();
  res.redirect('/login');
}


module.exports = (app, passport)=> {        
    //app.use(passport.initialize());
    //app.use(passport.session());

    app.get('/', (req, res)=> {       
      res.end('<html>Node-Adhoc-Admin <br/><a href="/dashboard">Go to dashboard</a></html>');    
      req.flash('errorMessage', 'gea');
    });

    app.get('/login', (req, res)=> {
      res.render('login');
    });

    // process the login form
    app.post('/login', passport.authenticate('local-login', {
        successRedirect : '/dashboard', // redirect to the secure profile section
        failureRedirect : '/abc', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));

    app.get('/signup', (req, res)=> {
      res.render('signup');
    });
    
    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect : '/dashboard', // redirect to the secure profile section
        failureRedirect : '/signup', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));

    app.get('/logout', (req, res)=> {       
      req.logout();
      res.redirect('/');
    });
    
    

    app.get('/dashboard', isLoggedIn, (req, res)=> {       
      let data = {};
      data.pageHeading = "AdHoc Labs Admin";
      data.pageSubHeading = "Dashboard";
      data.user = req.user;
      res.render('dashboard', data);    
    });

    app.get('/student', isLoggedIn, (req, res)=> {       
      let data = {};
      data.pageHeading = "AdHoc Labs Admin";
      data.pageSubHeading = "Student";
      data.user = req.user;
      res.render('student', data);    
    });

    app.get('/batch', isLoggedIn, (req, res)=> {       
      let data = {};
      data.pageHeading = "AdHoc Labs Admin";
      data.pageSubHeading = "Batch";
      data.user = req.user;
      res.render('batch', data);    
    });

    app.get('/course', isLoggedIn, (req, res)=> {       
      let data = {};
      data.pageHeading = "AdHoc Labs Admin";
      data.pageSubHeading = "Course";
      data.user = req.user;
      res.render('course', data);    
    });
///////////////Student
    app.get('/student/all', isLoggedIn, (req, res)=> {
      student.all(req,res,(data)=>{
        data.pageHeading = 'Student';
        data.pageSubHeading = 'List';
        data.user = req.user;
        res.render('liststudents', data);
      });
    });
    
    app.get('/student/id/:ahId', isLoggedIn, (req, res)=> {
      student.getStudent(req,res,(data)=>{
        data.pageHeading = 'Student';
        data.pageSubHeading = 'Details';
        data.user = req.user;
        res.render('showstudent', data);
      });
    });

    app.get('/student/create', isLoggedIn, (req, res)=> {
      let data = {};
      data.pageHeading = 'Student';
      data.pageSubHeading = 'Create New';
      data.user = req.user;
      res.render('createstudent', data);
    });

    app.post('/student/create', isLoggedIn, (req, res)=> {
      student.createStudent(req,res,(found)=>{
        //res.json(found);
        let data = {};
        data.pageHeading = "AdHoc Labs Admin";
        data.pageSubHeading = "Dashboard";
        data.user = req.user;
        if(found.res) data.successMessage = found.response;
        else  data.errorMessage = found.response;
        res.render('dashboard', data);
      });
    });

    app.get('/student/update/:ahId', isLoggedIn, (req, res)=> {
      student.getStudent(req,res,(data)=>{
        data.pageHeading = 'Student';
        data.pageSubHeading = 'Update Details';
        data.user = req.user;
        //console.log(data);
        res.render('updatestudent', data);
      });
    });

    app.post('/student/update/:studentId', isLoggedIn, (req, res)=> {
      student.updateStudent(req,res,(found)=>{
        //res.json(found);
        let data = {};
        data.pageHeading = "AdHoc Labs Admin";
        data.pageSubHeading = "Dashboard";
        data.user = req.user;
        if(found.res) data.successMessage = found.response;
        else  data.errorMessage = found.response;
        res.render('dashboard', data);
      });
    });

    app.get('/student/addtobatch', isLoggedIn, (req, res)=> {
      let data = {};
      data.pageHeading = 'Student';
      data.pageSubHeading = 'Register to Batch';
      data.studentId = req.query.sid;
      data.user = req.user;
      res.render('addtobatch', data);
    });

    app.post('/student/addtobatch', isLoggedIn, (req, res)=> {
      student.addStudentToBatch(req,res,(found)=>{
        //res.json(found);
        let data = {};
        data.pageHeading = "AdHoc Labs Admin";
        data.pageSubHeading = "Dashboard";
        data.user = req.user;
        if(found.res) data.successMessage = found.response;
        else  data.errorMessage = found.response;
        res.render('dashboard', data);
      });
    });

    app.get('/student/addpayment', isLoggedIn, (req, res)=> {
      let data = {};
      data.pageHeading = 'Student';
      data.pageSubHeading = 'Add Payment';
      data.studentId = req.query.studentId;
      data.batchId = req.query.batchId;
      data.user = req.user;
      res.render('addpayment', data);
    });

    app.post('/student/addpayment', isLoggedIn, (req, res)=> {
      student.payment(req,res,(found)=>{
        //res.json(found);
        let data = {};
        data.pageHeading = "AdHoc Labs Admin";
        data.pageSubHeading = "Dashboard";
        data.user = req.user;
        if(found.res) data.successMessage = found.response;
        else  data.errorMessage = found.response;
        res.render('dashboard', data);
      });
    });

    app.get('/student/showpayments', isLoggedIn, (req, res)=> {
      student.showPayments(req,res,(data)=>{
        data.pageHeading = 'Student';
        data.pageSubHeading = 'Registration Details';
        data.user = req.user;
        res.render('showpayments', data);
      });
    });

//////////////Batches
    app.get('/batch/all', isLoggedIn, (req, res)=> {
      batch.all(req,res,(data)=>{
        data.pageHeading = 'Batch';
        data.pageSubHeading = 'List';
        data.user = req.user;
        res.render('listbatches', data);
      });
    });
    
    app.get('/batch/id/:batchId', isLoggedIn, (req, res)=> {
      batch.getBatch(req,res,(data)=>{
        data.pageHeading = 'Batch';
        data.pageSubHeading = 'Details';
        data.user = req.user; 
        res.render('showbatch', data);
      });
    });

    app.get('/batch/create', isLoggedIn, (req, res)=> {
      batch.courseall(req,res,(data)=>{
        data.pageHeading = 'Batch';
        data.pageSubHeading = 'Create New';
        data.user = req.user;
        res.render('createbatch', data)
      });
    });

    app.post('/batch/create', isLoggedIn, (req, res)=> {
      batch.createBatch(req,res,(found)=>{
        //res.json(found);
        let data = {};
        data.pageHeading = "AdHoc Labs Admin";
        data.pageSubHeading = "Dashboard";
        data.user = req.user;
        if(found.res) data.successMessage = found.response;
        else  data.errorMessage = found.response;
        res.render('dashboard', data);
      });
    });

    app.get('/batch/update/:batchId', isLoggedIn, (req, res)=> {
      batch.getBatch(req,res,(data)=>{
        data.pageHeading = 'Batch';
        data.pageSubHeading = 'Update Details';
        data.user = req.user;
        res.render('updatebatch', data);
      });
    });

    app.post('/batch/update/:batchId', isLoggedIn, (req, res)=> {
      batch.updateBatch(req,res,(found)=>{
        //res.json(found);
        let data = {};
        data.pageHeading = "AdHoc Labs Admin";
        data.pageSubHeading = "Dashboard";
        data.user = req.user;
        if(found.res) data.successMessage = found.response;
        else  data.errorMessage = found.response;
        res.render('dashboard', data);
      });
    });


//////////////Courses
    app.get('/course/all', isLoggedIn, (req, res)=> {
      batch.courseall(req,res,(data)=>{
        data.pageHeading = 'Course';
        data.pageSubHeading = 'List';
        data.user = req.user;
        res.render('listcourses', data);
      });
    });
    
    app.get('/course/id/:courseId', isLoggedIn, (req, res)=> {
      batch.getCourse(req,res,(data)=>{
        data.pageHeading = 'Course';
        data.pageSubHeading = 'Details';
        data.user = req.user;
        res.render('showcourse', data);
      });
    });

    app.get('/course/create', isLoggedIn, (req, res)=> {
      batch.courseall(req,res,(data)=>{
        data.pageHeading = 'Course';
        data.pageSubHeading = 'Create New';
        data.user = req.user;
        res.render('createcourse', data)
      });
    });

    app.post('/course/create', isLoggedIn, (req, res)=> {
      batch.createCourse(req,res,(found)=>{
        //res.redirect('/course/create'); //id error show flash msg
        let data = {};
        data.pageHeading = "AdHoc Labs Admin";
        data.pageSubHeading = "Dashboard";
        data.user = req.user;
        if(found.res) data.successMessage = found.response;
        else  data.errorMessage = found.response;
        res.render('dashboard', data);
      });
    });

    app.get('/course/update/:courseId', isLoggedIn, (req, res)=> {
      batch.getCourse(req,res,(data)=>{
        data.pageHeading = 'Course';
        data.pageSubHeading = 'Update Details';
        data.user = req.user;
        res.render('updatecourse', data);
      });
    });

    app.post('/course/update/:courseId', isLoggedIn, (req, res)=> {
      batch.updateCourse(req,res,(found)=>{
        //res.json(found);
        let data = {};
        data.pageHeading = "AdHoc Labs Admin";
        data.pageSubHeading = "Dashboard";
        data.user = req.user;
        if(found.res) data.successMessage = found.response;
        else  data.errorMessage = found.response;
        res.render('dashboard', data);
      });
    });

//////////////////////////////

}     