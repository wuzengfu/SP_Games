/*
  Name: Wu Zengfu
  Admission Number: 2033457
  Class: DIT/04
*/
var db = require('./databaseConfig.js');

var reviewDB = {

    /**
     * Endpoint 10: POST /user/:uid/game/:gid/review/ (Add a new review to a game)
     * 
     * This checks if the userid and the gameid exist.
     */
    postReview: function (uid, gid, content, rating, callback) {
        var conn = db.getConnection();

        conn.connect(err => {
            if (err) {
                return callback(err, null);
            } else {
                var sql = "SELECT title FROM game WHERE gameid = ?;";
                conn.query(sql, [gid], (err, result) => {
                    if (err) {
                        return callback(err, null);
                    } else {
                        if (result.length === 0) {
                            return callback(null, -1);
                        } else {
                            sql = "INSERT INTO reviews (posterid,gameid,content,rating) VALUES (?,?,?,?);";
                            conn.query(sql, [uid, gid, content, rating], (err, result) => {
                                conn.end();
                                if (err) {
                                    return callback(err, null);
                                } else {
                                    return callback(null, result);
                                };
                            });
                        }
                    }
                });
            }
        });
    },

    /**
     * Endpoint 11: GET /game/:id/review  (Retrieves reviews of a particular game, including info like the username.)
     * 
     * This checks if the gameid exists or it has a review.
     */
    getReviews: function (gid, callback) {
        var conn = db.getConnection();

        conn.connect(err => {
            if (err) {
                return callback(err, null);
            } else {
                var sql = "SELECT gameid FROM game WHERE gameid = ?;";
                conn.query(sql, [gid], (err, result) => {
                    if (err) {
                        return callback(err, null);
                    } else {
                        if (result.length === 0) {
                            return callback(null, -1);
                        } else {
                            sql = "SELECT r.gameid , r.content, r.rating, u.username , r.created_at FROM reviews r , user u WHERE u.userid = r.posterid AND r.gameid = ?;";
                            conn.query(sql, [gid], (err, result) => {
                                conn.end();
                                if (err) {
                                    return callback(err, null);
                                } else {
                                    if (result.length == 0) {
                                        return callback(null, -2);
                                    } else {
                                        for (let i = 0; i < result.length; i++) {
                                            result[i].gameid = JSON.stringify(result[i].gameid);
                                            result[i].rating = JSON.stringify(result[i].rating);
                                        }
                                        result.reverse();
                                        return callback(null, result);
                                    }
                                }
                            });
                        }
                    }
                });
            }
        });
    },

    /**
     * Endpoint 12: DELETE /review/:id  (Delete a review by its review id)
     * 
     * This checks if the provided review id exists
     */
    deleteReview: function (id, callback) {
        var conn = db.getConnection();

        conn.connect(err => {
            if (err) {
                return callback(err, null);
            } else {
                var sql = "DELETE FROM reviews WHERE reviewid = ?;";

                conn.query(sql, [id], (err, result) => {
                    conn.end();
                    if (err) {
                        return callback(err, null);
                    } else {
                        return callback(null, result.affectedRows);
                    }
                });
            }
        });
    }
};

module.exports = reviewDB;