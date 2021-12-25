const bcrypt = require("bcryptjs");

const queryString =  require("query-string");

var nodemailer = require('nodemailer');

var md5 = require('md5');

var connection = require('../../config/database');


const stringifiedParams = queryString.stringify({
  client_id: process.env.FACEBOOK_CLIENT_ID,
  redirect_uri: 'http://localhost:3000/authenticate/facebook/',
  scope: ['email', 'user_friends'].join(','), // comma seperated string
  response_type: 'code',
  auth_type: 'rerequest',
  display: 'popup',
});

const facebookLoginUrl = `https://www.facebook.com/v4.0/dialog/oauth?${stringifiedParams}`;

var sessionData;

const loginView = (req, res) => {

    res.render('login', { title: 'Login Page','facebookurl':facebookLoginUrl});
}

const registerView = (req, res) => {

    res.render('register', { title: 'Pegister Page'});
}


const login = (req,res,next)=> {

    const { email, password } = req.body;

    connection.query("SELECT * FROM users WHERE email = '"+email+"' and password=md5('"+password+"') ", function (err, rows, fields) {
        if (err) {
            throw err;

        } else {

            req.session.name = rows[0].name;
            req.session.iduser = rows[0].id;
            req.session.role = rows[0].role;
            req.session.active = rows[0].active;
            req.session.channel = 'manual';
            req.session.logged_in = true;
            //session_store = rows[0];
            
            res.redirect('/admin');
        }
    });
}

const register = (req, res) => {
  const { name,email,password, repassword } = req.body;
  
  var token = md5(name+email+"verifikasiemailuser");

  var mailOptions = {
      from: 'emailjunk430@gmail.com',  // sender address
      to: 'aziz8009@gmail.com',   // list of receivers
      subject: 'Email verification',
      text: '',
      html: '<b>Hey '+name+'! </b> <br> Please click this link for verificatiom </br> <a href="'+process.env.DOMAIN+'verification/'+token+'">verification email Here</a><br/>',
  };

  transporter.sendMail(mailOptions, (err, info) => {
      if (err) throw err;
  });

  if (!name || !email || !password || !repassword) {
    res.send("Fill empty fields");
  }

  //Confirm Passwords
  if (password !== repassword) {
    res.send("Password does not match")
  } else {
    
    connection.query("SELECT * FROM users WHERE email = '"+email+"' ",function (err, result, fields) {
      if (err) throw err;
      if(result && result[0]){

        res.send("Data has been added, check your email to verification")

      }else{

        connection.query("INSERT into users (name,email,password,active,channel,confirm,token) VALUES('"+name+"','"+email+"','"+md5(password)+"','0','manual','not confirmed','"+token+"')");

        res.send("Success register, please cek your email, to verification");
      }
      
    });
    
  }

}

const logout = (req, res) => {

    req.session.destroy(function(err){
      if(err){
        console.log(err);
      } else {
        res.redirect('/login');
      }
    });
}

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'emailjunk430@gmail.com',
        pass: 'mabdulaziz2014tix',
    }
});


module.exports =  {
    loginView,
    registerView,
    login,
    register,
    logout
};