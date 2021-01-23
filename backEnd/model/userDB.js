/*
  Name: Wu Zengfu
  Admission Number: 2033457
  Class: DIT/04
*/
var db = require('./databaseConfig.js');

var userDB = {
    //0
    verify: function (username, password, callback) {

        var dbConn = db.getConnection();
        dbConn.connect(function (err) {

            if (err) {//database connection gt issue!

                console.log(err);
                return callback(err, null);
            } else {

                const query = "SELECT * FROM user WHERE username=? and password=?";

                dbConn.query(query, [username, password], (error, results) => {
                    if (error) {
                        callback(error, null);
                        return;
                    }
                    if (results.length === 0) {
                        return callback(null, null);

                    } else {
                        const user = results[0];
                        return callback(null, user);
                    }
                });
            }
        });
    },



    /**
     * Endpoint 1: GET /users  (Retrieve all users' information)
     * 
     * It only retrieves the users with admin or customer type
     */
    getUsers: function (callback) {
        var conn = db.getConnection();

        conn.connect(err => {
            if (err) {
                return callback(err, null);
            } else {
                console.log("Connected!");
                var sql = "SELECT * FROM user WHERE type = ? OR type = ?";
                conn.query(sql, ["customer", "admin"], (err, result) => {
                    conn.end();
                    if (err) {
                        return callback(err, null);
                    } else {
                        return callback(null, result);
                    }
                })
            }
        })
    },

    /**
     * Endpoint 2: POST /users/  (Add a new user)
     * 
     * This checks if there is a user with same user name, email or profile_pic_url already existed.
     */
    postUser: function (username, email, type, profile_pic_url, callback) {
        var conn = db.getConnection();

        conn.connect(err => {
            if (err) {
                console.log(err);
                return callback(err, null);
            } else {
                console.log("Connected!");
                var sql = "INSERT INTO user (username,email,type,profile_pic_url) VALUES(?, ? , ? ,?);";
                conn.query(sql, [username, email, type, profile_pic_url], (err, result) => {
                    conn.end();
                    if (err) {
                        if (err.code == "ER_DUP_ENTRY") {
                            return callback(null, -1);
                        } else {
                            return callback(err, null);
                        }
                    } else {
                        return callback(null, result);
                    }
                });
            }
        });
    },

    /**
     * Endpoint 3: GET /users/:id/  (Get a single user by its id)
     * 
     * This checks if the user id provided exists.
     */
    getUser: function (id, callback) {
        var conn = db.getConnection();

        conn.connect(err => {
            if (err) {
                return callback(err, null);
            } else {
                console.log("Connected!");
                var sql = "SELECT * FROM user WHERE userid = ?;";
                conn.query(sql, [id], (err, result) => {
                    conn.end();
                    if (err) {
                        return callback(err, null);
                    } else if (result.length === 0) {
                        return callback(null, -1);
                    } else {
                        return callback(null, result);
                    }
                })
            }
        })
    }
}

module.exports = userDB;