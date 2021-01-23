/* 
  Name: Wu Zengfu
  Admission Number: 2033457
  Class: DIT/04
*/
const mysql = require('mysql');

const dbconnect = {
    getConnection: function () {
        const conn = mysql.createConnection({
            host: "localhost",
            user: "root",
            password: "18106910338",
            database: "sp_games"
        });
        return conn;
    }
};

module.exports = dbconnect;