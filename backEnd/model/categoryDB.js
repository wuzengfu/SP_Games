/*
  Name: Wu Zengfu
  Admission Number: 2033457
  Class: DIT/04
*/
var db = require('./databaseConfig.js');

var catDB = {

    /**
     * Endpoint 4: POST /category  (Insert a new category)
     * 
     * This checks if such a category already exists.
     */
    postCategory: function (catname, description, callback) {
        var conn = db.getConnection();

        conn.connect(err => {
            if (err) {
                return callback(err, null);
            } else {
                console.log("Connected!");
                var sql = "INSERT INTO category (catname,description) VALUES (?,?);";
                conn.query(sql, [catname, description], (err, result) => {
                    conn.end();
                    if (err) {
                        if (err.code === "ER_DUP_ENTRY") {
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
     * Endpoint 5: PUT /category/:id/  (Update a category by its id)
     * 
     * This checks if such a category exists given by its category id.
     */
    updateCategory: function (catname, description, id, callback) {
        var conn = db.getConnection();

        conn.connect(err => {
            if (err) {
                return callback("Unknown error", null);
            } else {
                console.log("Connected!");
                var sql = "SELECT * FROM category WHERE catid = ?;";
                conn.query(sql, [id], (err, result) => {
                    if (err) {
                        return callback("Unknown error", null);
                    } else {
                        if (result.length === 0) {
                            return callback("The category id of " + id + " does not exist!", null);
                        } else {
                            if (catname == "" || catname == null) catname = result[0].catname;
                            if (description == "" || description == null) description = result[0].description;

                            sql = "UPDATE category SET catname = ? , description = ? WHERE catid = ?;";
                            conn.query(sql, [catname, description, id], (err, result) => {
                                conn.end();
                                if (err) {
                                    if (err.code === 'ER_DUP_ENTRY') {
                                        return callback("The category name of " + catname + " has already existed!", -1);
                                    } else {
                                        return callback("Unknown error", null);
                                    }
                                } else {
                                    return callback(null, result);
                                }
                            });
                        }
                    }
                });
            }
        });
    },

    /** 
     * Endpoint 13: DELETE /game/:gameid/category/:catid  (Delete a category from a game)
     * 
     * This checks if the game id provided exists.
    */
    deleteGameCategory: function (gameid, catid, callback) {
        var conn = db.getConnection();

        conn.connect(err => {
            if (err) {
                return callback("Unknown error", null);
            } else {
                console.log("Connected!");
                var sql = "SELECT title FROM game WHERE gameid = ?;";
                conn.query(sql, [gameid], (err, result) => {
                    if (err) {
                        return callback("Unknown error", null);
                    } else {
                        if (result.length === 0) {
                            return callback("Gameid " + gameid + " does not exist!", null);
                        } else {
                            sql = "DELETE FROM game_categories WHERE gameid = ? AND catid = ? ;";
                            conn.query(sql, [gameid, catid], (err, result) => {
                                conn.end();
                                if (err) {
                                    return callback("Unknown error", null);
                                } else {
                                    return callback(null, result);
                                }
                            });
                        }
                    }
                });
            }
        });
    }
};

module.exports = catDB;

