var express = require('express');

const passport =require('passport');

const FacebookStrategy  =  require('passport-facebook').Strategy;

const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

var connection = require('../config/database');
var Auth_mdw = require('../middlewares/auth');

var router = express.Router();

var secret = 'expresstest';
var session_store;
var userProfile;

// var app = express();
// app.use(passport.initialize());
// app.use(passport.session());

/* load controller */
const {loginView,registerView,login,register,logout} = require('../controllers/auth/loginControllers');
const {verification} = require('../controllers/users/listsControllers');

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

passport.use(new FacebookStrategy({
  clientID: process.env.FACEBOOK_CLIENT_ID,
  clientSecret:process.env.FACEBOOK_CLIENT_SECRET ,
  callbackURL: process.env.FACEBOOK_CALLBACK
},
function(accessToken, refreshToken, profile, done) {

    userProfile=profile;
    
    process.nextTick(function () {
      
      connection.query("SELECT * from users where channelid='"+profile.id+"'", (err,rows) => {
        if(err) throw err;

        if(rows && rows.length == 0) {
            console.log("There is no such user, adding now");
            connection.query("INSERT into users (channelid,name,active,channel,confirm,role) VALUES('"+profile.id+"','"+profile.displayName+"','1','facebook','confirmed','user')");
        }

      });

      return done(null, profile);
    });
  }
));

/*  Google AUTH  */
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/callback"
  },
  function(accessToken, refreshToken, profile, done) {
      userProfile=profile;

      process.nextTick(function () {
        var Email = (userProfile.emails && userProfile.emails[0]) ? userProfile.emails[0].value : '';

        connection.query("SELECT * from users where channelid='"+profile.id+"'", (err,rows) => {
          if(err) throw err;

          if(rows && rows.length == 0) {
              console.log("There is no such user, adding now");
              connection.query("INSERT into users (channelid,name,email,active,channel,confirm,role) VALUES('"+profile.id+"','"+profile.displayName+"','"+Email+"','1','Google','confirmed','user')");
          }

        });

        return done(null, profile);
      });
      //return done(null, userProfile);
  }
));

/* home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Home' });
});

/* login page */
router.get('/login', loginView);
router.post('/login',login)

router.get('/logout', logout);

/* register page*/
router.get('/register', registerView);
router.post('/register',register);

/* omny channel facebook, google auth*/
router.get('/auth/facebook', passport.authenticate('facebook',{ scope : 'email,user_photos' }));

router.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));

router.get('/auth/facebook/callback',passport.authenticate('facebook', { successRedirect : '/success', failureRedirect: '/error' }),
  function(req, res) {
    res.redirect('/success');
});

router.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/error' }),function(req, res) {
  // Successful authentication, redirect success.
  res.redirect('/success');
});

router.get('/success', function(req, res) {
    //res.send(userProfile);
    req.session.name = userProfile.displayName;
    req.session.iduser = userProfile.id;
    req.session.role = 'user';
    req.session.channel = '-';
    req.session.active = 1;
    req.session.logged_in = true;

    res.redirect('/admin');
});

router.get('/error', (req, res) => res.send("error logging in"));

/* verifikasi email. */
router.get('/verification/:token', verification);

module.exports = router;