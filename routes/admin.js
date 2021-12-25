var express = require('express');
var router = express.Router();

var connection = require('../config/database');

var Auth_mdw = require('../middlewares/auth');

const {userList,userEdit,userUpdate}  = require('../controllers/users/listsControllers');

/* GET home page. */
router.get('/', Auth_mdw.check_login, function(req, res, next) {
  var session_store = req.session;
 
  if(session_store.channel == "manual"){

    connection.query("SELECT * FROM users WHERE id = '"+session_store.iduser+"'", function (err, rows, fields) {
      
      if (err) {
          throw err;

      } else {

           res.render('pages/home', { title: 'DASHBOARD','data_store' : rows[0]});
      }

    })

  }else{

    connection.query("SELECT * FROM users WHERE channelid = '"+session_store.iduser+"'", function (err, rows, fields) {
      
      if (err) {
          throw err;

      } else {
          
          if(rows[0]){
            res.render('pages/home', { title: 'DASHBOARD','data_store' : rows[0]});
          }else{
            res.render('pages/home', { title: 'DASHBOARD','data_store' : session_store});
          }
      }

    })

  }
    

 

});


/* users page. */
router.get('/users',Auth_mdw.check_login, userList);
router.get('/users/:userid', Auth_mdw.check_login,userEdit);
router.post('/users/:userid', Auth_mdw.check_login,userUpdate);


module.exports = router;
