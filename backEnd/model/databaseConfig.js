/*
  Name: Wu Zengfu
  Admission Number: 2033457
  Class: DIT/04
*/
const mysql = require('mysql');

require('dotenv').config();

const dbconnect = {
    getConnection: function () {
        const conn = mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USERNAME,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_DATABASE
        });
        return conn;
    }
};

module.exports = dbconnect;
