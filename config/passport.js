const passport      = require('passport'),
    LocalStrategy   = require('passport-local').Strategy;
const mongoose      = require('mongoose');
mongoose.Promise    = require('bluebird');
const User = mongoose.model('User');

// expose this function to our app using module.exports
module.exports = (passport) => {

    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    passport.serializeUser((user, done) => {
        //console.log('serializing: ');
        //console.log(user);
        done(null, user._id);
    });

    // used to deserialize the user
    passport.deserializeUser((id, done) => {
        //console.log('deserializing');
        User.findById(id, (err, user) => {
            done(err, user);
        });
    });

    // =========================================================================
    // LOCAL SIGNUP ============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use('local-signup', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    (req, email, password, done) => {
        // asynchronous
        // User.findOne wont fire unless data is sent back
        process.nextTick(() => {

        // find a user whose email is the same as the forms email
        // we are checking to see if the user trying to login already exists
        User.findOne({ 'email' :  email },(err, user) => {
            // if there are any errors, return the error
            
            if (err)
                return done(err);

            // check to see if theres already a user with that email
            if (user) {
                return done(null, false, {'errorMessages': 'That email is already taken.'});
            } else {

                // if there is no user with that email
                // create the user
                let newUser            = new User();

                // set the user's local credentials
                newUser.fullname       = req.body.fullname;
                newUser.email          = email;
                newUser.password       = newUser.generateHash(password);
                newUser.created        = new Date();

                // save the user
                newUser.save((err)=>{
                    if (err)
                        return done(err);
                    return done(null, newUser);
                });
            }
        });    
        });
    }));

// =========================================================================
    // LOCAL LOGIN =============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use('local-login', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    (req, email, password, done)=> { // callback with email and password from our form

        // find a user whose email is the same as the forms email
        // we are checking to see if the user trying to login already exists
        User.findOne({ 'email' :  email }, (err, user)=> {
            // if there are any errors, return the error before anything else
            //console.log('-------------1');
            //console.log(user);
            //console.log(err);
            //console.log(email);
            if (err)
                return done(err);

            // if no user is found, return the message
            if (!user)
                return done(null, false, req.flash('errorMessages', 'No user found.')); // req.flash is the way to set flashdata using connect-flash

            // if the user is found but the password is wrong
            if (!user.validPassword(password))
                return done(null, false, req.flash('errorMessages', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata
            // all is well, return successful user
            console.log('login success');
            user.lastLogin = new Date();
            user.save((err)=> {
                if(err)
                    return done(err);
                return done(null, user); 
            });
            
        });

    }));

};