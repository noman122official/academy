#!/bin/node
'use strict';
const express      = require('express');
const app          = express();
app.locals.moment  = require('moment');
const fs           = require('fs');
const path         = require('path');
const configs      = require('./config.json');
const logger       = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser   = require('body-parser');
const session      = require('express-session');
const passport     = require('passport');
const flash        = require('connect-flash');

//Database
const mongoose     = require('mongoose');
mongoose.connect('mongodb://'+configs.db_url);
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
const MongoStore   = require('connect-mongo')(session);

//Bootstrap models
let models_path =  './models';
fs.readdirSync(models_path).forEach(function (file) {
  if (~file.indexOf('.js')) require(models_path + '/' + file)
});

app.set('port',process.env.PORT ||3000);
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'jade');
app.use(express.static(path.join(__dirname, 'public')));
app.set('json spaces', 25);

app.use(cookieParser());
app.set('trust proxy', 1) // trust first proxy
app.use(session({ 
  store: new MongoStore({ mongooseConnection: mongoose.connection }),
  secret: 'lololppapadhoclabadhoclab',
  name: 'sessionId',
  resave: false,
  saveUninitialized: true,
  cookie: { 
    //secure:   true,
    maxAge:   24*60*60*1000 } 
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use((req, res, next)=>{
  let successMessages = req.flash('successMessages');
  let errorMessages = req.flash('errorMessages');
  res.locals.successMessages =successMessages;
  res.locals.errorMessages =errorMessages;
  next();
});

require('./config/passport')(passport);
require('./routes.js')(app, passport);  
//routes

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

app.listen(app.get('port'),()=>{
//  mongoose.connect('mongodb://'+configs.db_url);
  console.log("Environment : " + app.get('env'));
  console.log("now running on port: "+app.get('port'));
});

