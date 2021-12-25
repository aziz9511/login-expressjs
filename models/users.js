var connection = require('../config/database');

const lists = (req, res) => {


    try {

      let result = connection.query("SELECT * FROM users ORDER BY id desc", function (err, rows, fields) {

          if (rows.length == 1) {

            return rows;

          } else {

            return req.params;

          }

      });

      return result;

    } catch (err) {

      throw err;

    }

}


module.exports =  {
    lists
};
