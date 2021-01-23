/*
  Name: Wu Zengfu
  Admission Number: 2033457
  Class: DIT/04
*/
var db = require('./databaseConfig.js');
var fs = require('fs');
const { connect } = require('../controller/router.js');

var gameDB = {

    /**
     * Endpoint 6: POST /game  (Add a new game)
     * 
     * This checks the following: 
     * 
     * (1) Duplicate game title
     * (2) Category ID is not a number
     * 
     */
    postGame: function (title, description, price, platform, categoryid, year, callback) {
        var conn = db.getConnection();

        conn.connect(err => {
            if (err) {
                return callback("Unknown error", null);
            } else {
                console.log("Connected!");
                var sql = "SELECT gameid FROM game WHERE title = ?;";
                conn.query(sql, [title], (err, result) => {
                    if (err) {
                        return callback("Unknown error", null);
                    } else {
                        //duplicate game title
                        if (result.length !== 0) {
                            return callback("Game title of " + title + " already exists!", null);
                        } else {
                            //new game
                            sql = "INSERT INTO game (title, description, price, platform, year) VALUES (?,?,?,?,?);";
                            conn.query(sql, [title, description, price, platform, year], (err, result) => {
                                if (err) {
                                    return callback("Unknown error", null);
                                } else {
                                    var gameid = result.insertId;
                                    if (err) {
                                        return callback("Unknown error", null);
                                    } else {
                                        if (isNaN(categoryid * 1)) {
                                            var categoryIDs = categoryid.split(",");

                                            for (let i = 0; i < categoryIDs.length; i++) {
                                                if (isNaN(categoryIDs[i] * 1)) {
                                                    return callback("Category ID " + categoryIDs[i] + " is not a number!", null);
                                                }
                                            }

                                            for (let i = 0; i < categoryIDs.length; i++) {
                                                sql = "SELECT catid FROM category WHERE catid = ?;";
                                                conn.query(sql, [categoryIDs[i]], (err, result) => {
                                                    if (err) {
                                                        return callback("Unknown error", null);
                                                    }
                                                    else if (result.length === 0) {
                                                        conn.end();
                                                        return callback("Category id " + categoryIDs[i] + " not existed!", null);
                                                    } else {
                                                        sql = "INSERT INTO game_categories (gameid,catid) VALUES (?,?);";
                                                        conn.query(sql, [gameid, categoryIDs[i]], (err, result) => {
                                                            if (err) {
                                                                return callback("Unknown error", null);
                                                            } else {
                                                                if (i === categoryIDs.length - 1) {
                                                                    conn.end();
                                                                    return callback(null, gameid);
                                                                }
                                                            }
                                                        });
                                                    }

                                                });
                                            }
                                        } else {
                                            sql = "INSERT INTO game_categories (gameid,catid) VALUES (?,?);";
                                            conn.query(sql, [gameid, categoryid], (err, result) => {
                                                conn.end();
                                                if (err) {
                                                    return callback("Unknown error", null);
                                                } else {
                                                    return callback(null, gameid);
                                                }
                                            });
                                        }
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
     * Endpoint 7: GET /games/:platform  (Retrieve all games given by platform)
     * 
     * If the game has multiple categories, it returns all categories in array form.
     */
    getGamesByPlatform: function (platform, callback) {
        var conn = db.getConnection();

        conn.connect(err => {
            if (err) {
                return callback("Unknown error", null);
            } else {
                console.log("Connected!");

                var sql = "SELECT g.gameid , g.title , g.description , g.price , g.platform ,g.year , g.created_at, g.image FROM game g WHERE g.platform = ?;";
                if (platform == 'null') {
                    sql = "SELECT g.gameid , g.title , g.description , g.price , g.platform ,g.year , g.created_at ,g.image FROM game g;"
                }
                conn.query(sql, [platform], (err, result) => {
                    if (err) {
                        return callback("Unknown error", null);
                    } else {
                        if (result.length === 0) {
                            return callback(null, -1);
                        } else {
                            var gameDetails = result;
                            const selectedId = result.map(ele => ele.gameid);

                            sql = "SELECT gc.catid , c.catname FROM game_categories gc , category c WHERE gc.gameid = ? AND gc.catid = c.catid;";
                            for (let i = 0; i < gameDetails.length; i++) {
                                conn.query(sql, [selectedId[i]], (err, result) => {
                                    if (err) {
                                        return callback("Unknown error", null);
                                    } else {
                                        const year = gameDetails[i].year;
                                        const created_at = gameDetails[i].created_at;

                                        delete gameDetails[i].year;
                                        delete gameDetails[i].created_at;

                                        gameDetails[i].price = JSON.stringify(gameDetails[i].price);
                                        gameDetails[i].categories = result;
                                        gameDetails[i].year = year;
                                        gameDetails[i].created_at = created_at;
                                    }
                                    if (i == gameDetails.length - 1) {
                                        conn.end();
                                        console.log(gameDetails);
                                        return callback(null, gameDetails);
                                    }
                                });
                            }
                        }
                    }
                });
            }
        });
    },

    /**
     * Endpoint 8: DELETE /game/:id/  (delete a game given by its id)
     * 
     * This checks if the game id exists.
     */
    deleteGame: function (id, callback) {
        var conn = db.getConnection();

        conn.connect(err => {
            if (err) {
                return callback(err, null);
            } else {
                console.log("Connected!");
                var sql = "DELETE FROM game WHERE gameid = ?;";
                conn.query(sql, [id], (err, result) => {
                    conn.end();
                    if (err) {
                        return callback(err, null);
                    } else {
                        if (result.affectedRows === 0) {
                            return callback(null, -1);
                        } else {
                            return callback(null, result);
                        }
                    }
                });
            }
        });
    },

    /** 
     * Endpoint 9: PUT /game/:id  (Update a game given by its id)
     * 
     * The values of all game details will not be null even if users did not enter those values.
     * 
     * To update the categories of a game, enter categories in an array form. [oldCategory,newCategory,oldCategory,newCategory...]. Example: [2,3,7,9] means changing cateogry 2 to category 3 and changing category 7 to category 9.
     * 
     * This checks the following:
     * 
     * (1)If the game id exists.
     * 
     * (2)If category id is a number.
     * 
     * (3)If one category id is missing (when categoryid.length is not an even number)
    */
    updateGame: function (title, description, price, platform, categoryid, year, id, callback) {
        var conn = db.getConnection();

        console.log(categoryid);
        conn.connect(err => {
            if (err) {
                return ("Unknown error", null);
            } else {
                console.log("Connected!");

                var sql = "SELECT * FROM game WHERE gameid = ?;";
                conn.query(sql, [id], (err, result) => {
                    if (err) {
                        return callback("Unknown error", null);
                    } else {
                        if (result.length === 0) {
                            return callback("Game id " + id + " does not exist!", null);
                        } else {
                            console.log(result);
                            if (title === "" || title == null) title = result[0].title;
                            if (description === "" || description == null) description = result[0].description;
                            if (price === "" || price == null) price = result[0].price;
                            if (platform === "" || platform == null) platform = result[0].platform;
                            if (year === "" || year == null) year = result[0].year;

                            if (categoryid == "" || categoryid == null) {
                                sql = "UPDATE game SET title = ? , description = ? , price = ? , platform = ? , year = ? WHERE gameid = ?;";
                                conn.query(sql, [title, description, price, platform, year, id], (err, result) => {
                                    if (err) {
                                        if (err.code === 'ER_DUP_ENTRY') {
                                            return callback("The game title " + title + " has alreay existed!", -1);
                                        } else {
                                            return callback("Unknown error", null);
                                        }
                                    } else {
                                        return callback(null, result);
                                    }
                                });
                            } else {
                                if (isNaN(categoryid * 1)) {
                                    const categoryIDs = categoryid.split(",");

                                    if (categoryIDs.length % 2 === 0) {
                                        for (let i = 0; i < categoryIDs.length; i++) {
                                            if (isNaN(categoryIDs[i])) {
                                                return callback("Category ID " + categoryIDs[i] + " is not a number!", null);
                                            };
                                        }

                                        sql = "UPDATE game SET title = ? , description = ? , price = ? , platform = ? , year = ? WHERE gameid = ?;";
                                        conn.query(sql, [title, description, price, platform, year, id], (err, result) => {
                                            if (err) {
                                                if (err.code === 'ER_DUP_ENTRY') {
                                                    return callback("The game title " + title + " has alreay existed!", -1);
                                                } else {
                                                    console.log(err);
                                                    return callback("Unknown error", null);
                                                }
                                            } else {
                                                console.log(result);

                                                sql = "SELECT catid FROM category WHERE catid IN (?)";
                                                conn.query(sql, [categoryIDs, id], (err, result) => {
                                                    if (err) {
                                                        return callback("Unknown error", null);
                                                    } else {
                                                        if (result.length < categoryIDs.length) {
                                                            return callback("There is(are) " + (categoryIDs.length - result.length) + " category id(s) not found!", null);
                                                        } else {
                                                            sql = "UPDATE game_categories SET catid = ? WHERE catid = ? AND gameid = ?;";
                                                            for (let i = 0; i < categoryIDs.length; i++) {
                                                                conn.query(sql, [categoryIDs[i + 1], categoryIDs[i++], id], (err, result) => {
                                                                    if (err) {
                                                                        return callback("Unknown error", null);
                                                                    }
                                                                });
                                                                if (i == categoryIDs.length - 1) {
                                                                    conn.end();
                                                                    return callback(null, true);
                                                                }
                                                            }
                                                        }
                                                    }
                                                });
                                            }
                                        });
                                    } else {
                                        return callback("One more category ID is missing", null);
                                    }

                                } else {
                                    sql = "SELECT gameid FROM game_categories WHERE catid = ? AND gameid = ?;";
                                    conn.query(sql, [categoryid, id], (err, result) => {
                                        if (err) {
                                            return callback("Unknown error", null);
                                        } else {
                                            if (result.length !== 0) {
                                                return callback(null, true);
                                            } else {
                                                sql = "SELECT created_at FROM game_categories WHERE gameid = ? ORDER BY created_at DESC;";
                                                conn.query(sql, [id], (err, result) => {
                                                    if (err) {
                                                        return callback("Unknown error", null);
                                                    } else {
                                                        sql = "UPDATE game_categories SET catid = ? WHERE created_at = ? AND gameid = ?;";
                                                        conn.query(sql, [categoryid, result[0].created_at, id], (err, result) => {
                                                            if (err) {
                                                                return callback("Unknown error", null);
                                                            } else {
                                                                console.log(result);
                                                                sql = "UPDATE game SET title = ? , description = ? , price = ? , platform = ? , year = ? WHERE gameid = ?;";
                                                                conn.query(sql, [title, description, price, platform, year, id], (err, result) => {
                                                                    conn.end();
                                                                    if (err) {
                                                                        if (err.code === 'ER_DUP_ENTRY') {
                                                                            return callback("The game title " + title + " has alreay existed!", -1);
                                                                        } else {
                                                                            return callback("Unknown error", null);
                                                                        }
                                                                    } else {
                                                                        return callback(null, result);
                                                                    }
                                                                });
                                                            }
                                                        });
                                                    }
                                                });
                                            }
                                        }
                                    });
                                }
                            }
                        }
                    }
                });
            }
        });
    },

    /**
     * Endpoint 14: PUT /game/:gameid/image  (Upload an image to a game given by gameid)
     * 
     * This checks the following:
     * 
     * (1)If the file url provided is valid
     * 
     * (2)If the image format is in jpg format
     * 
     * (3)If the image size did not exceed 1MB
     * 
     * (4)If the game id exists
     */
    uploadImage: function (id, url, callback) {
        var conn = db.getConnection();

        conn.connect(err => {
            if (err) {
                return callback(err, null);
            } else {
                console.log("Connected!");

                var sql = "SELECT title FROM game WHERE gameid = ?;";
                conn.query(sql, [id], (err, result) => {
                    if (err) {
                        return callback(err, null);
                    } else {
                        if (result.length === 0) {
                            return callback(true, "Cannot find the game with gameid " + id + "!");
                        } else {
                            if (!fs.existsSync(url)) {
                                return callback(true, "Cannot find the file with url: " + url + " !");
                            } else {
                                if (url.endsWith(".jpg")) {
                                    var sizeInMegaBytes = (fs.statSync(url).size) / 1048576;

                                    if (sizeInMegaBytes >= 1) {
                                        return callback(true, "The file size is " + sizeInMegaBytes.toFixed(3) + "MB. The maximium size for image is 1MB!");
                                    } else {
                                        sql = "UPDATE game SET image = ? WHERE gameid = ?;";
                                        conn.query(sql, [url, id], (err, result) => {
                                            conn.end();
                                            if (err) {
                                                return callback(err, null);
                                            } else {
                                                return callback(null, result);
                                            }
                                        });
                                    }
                                } else {
                                    return callback(true, "The file is not in JPG format!");
                                }
                            }
                        }
                    }
                });
            }
        });
    },

    /**
     * Endpoint 15: GET /gamesWithImage  (Retrieve all games with game image info)
     */
    getAllgamesWithimage: function (callback) {
        var conn = db.getConnection();
        conn.connect(err => {
            if (err) {
                return callback(err, null);
            } else {
                console.log("Connected!");
                var sql = "SELECT * FROM game;";
                conn.query(sql, (err, result) => {
                    if (err) {
                        return callback(err, null);
                    } else {
                        for (let i = 0; i < result.length; i++) {
                            result[i].price = JSON.stringify(result[i].price);
                        }
                        return callback(null, result);
                    }
                });
            }
        });
    },

    getAllPlatforms: function (callback) {
        var conn = db.getConnection();
        conn.connect(err => {
            if (err) {
                return callback(err, null);
            } else {
                console.log("Connected!");
                var sql = "SELECT DISTINCT(platform) FROM game;";
                conn.query(sql, (err, result) => {
                    if (err) {
                        return callback(err, null);
                    } else {
                        return callback(null, result);
                    }
                });
            }
        });
    },

    getGameById: function (gameid, callback) {
        var conn = db.getConnection();
        // conn.connect(err => {
        //     var gameDetails;
        //     if (err) {
        //         return callback(err, null);
        //     } else {
        //         var sql = "SELECT * FROM game WHERE gameid = ?;";
        //         conn.query(sql, [gameid], (err, result) => {
        //             if (err) {
        //                 return callback(err, null);
        //             } else {
        //                 sql = "SELECT * FROM game"
        //                 return callback(null, result);
        //             }
        //         });
        //     }
        // });
        conn.connect(err => {
            if (err) {
                return callback("Unknown error", null);
            } else {
                console.log("Connected!");

                var sql = "SELECT * FROM game WHERE gameid = ?;";

                var gameDetails;
                conn.query(sql, gameid, (err, result) => {
                    if (err) {
                        return callback("Unknown error", null);
                    } else {
                        gameDetails = result[0];
                        console.log(gameDetails);
                        sql = "SELECT c.catname FROM category c, game_categories WHERE game_categories.gameid = ? AND game_categories.catid = c.catid;";
                        conn.query(sql, [gameid], (err, result) => {
                            console.log(result);
                            conn.end();
                            if (err) {
                                console.log(err);
                                return callback("Unknown error", null);
                            } else {
                                gameDetails.categories = result;
                                console.log(gameDetails);
                                return callback(null, gameDetails);
                            }
                        });


                    }
                });
            }
        });
    }
}

module.exports = gameDB;