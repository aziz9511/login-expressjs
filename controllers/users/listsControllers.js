//import database
const UserModel = require("../../models/users");
var connection = require('../../config/database');
const userList = (req, res) => {
    
    connection.query('SELECT * FROM users ORDER BY id desc', function (err, rows) {
        if (err) {
            req.flash('error', err);
            res.render('pages/users/lists', {
                data: {}
            });
        } else {
            //render ke view posts index
            res.render('pages/users/lists', {
                data: rows // <-- data posts
            });
        }
    });

}

const userEdit = (req, res) => {

    let id = req.params.userid;
    connection.query("SELECT * FROM users WHERE id = "+id, function (err, rows, fields) {
        if (err) {
            req.flash('error', err);
            res.render('pages/users/edit', {
                data: req.params
            });
        } else {
            
            res.render('pages/users/edit', {
                title: 'Edit User', 
                id: rows[0].id,
                name: rows[0].name,
                email: rows[0].email,
                message: req.flash('message')
            });
        }
    });

}

const userUpdate = (req, res) => {


    let id = req.params.userid;

    const { username,email,password, repassword } = req.body;

    if (!username || !email || !password || !repassword) {
        res.send("Fill empty fields");
      }

      //Confirm Passwords
      if (password !== repassword) {
        res.send("Password does not match")
      }

    connection.query("update users Set name='"+username+"', email='"+email+"', password=md5('"+password+"') WHERE id = "+id, function (err, rows, fields) {
        if (err) {
            req.flash('error', err);
            res.redirect('/admin/users/'+id);
        } else {
            req.flash('success','Success update data');
            res.redirect('/admin/users/'+id);
        }
    });

}

const verification = (req, res) => {

    let token = req.params.token;

    connection.query("SELECT * FROM users WHERE active=0 and token = '"+token+"'", function (err, rows, fields) {
        if (err) {
           
        } else {
             

             if(rows[0]){

                connection.query("UPDATE users SET active='1',confirm='confirmed' where token='"+token+"' ");
                
                res.render('pages/verifikasi', { title: 'verification email',status: 1,nama:rows[0].name });

             }else{

                res.render('pages/verifikasi', { title: 'verification email',status: 0,nama:'-' });
             }
             


        }
    });

}

module.exports =  {
    userList,
    userEdit,
    userUpdate,
    verification
};