let mysql = require('mysql');

const dotenv = require("dotenv");
dotenv.config();
// Mongo DB conncetion
const db_host = process.env.DB_HOST;
const db_users = process.env.DB_USER;
const db_pass = process.env.DB_PASS;
const db_database = process.env.DB_NAME;


let connection = mysql.createConnection({
   host: db_host,
   user: db_users,
   password: db_pass,
   database: db_database
 });

connection.connect(function(error){
   if(!!error){
     console.log(error);
   }else{
     console.log('Koneksi Berhasil!');
   }
 })

module.exports = connection; 