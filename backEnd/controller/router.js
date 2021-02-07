/*
  Name: Wu Zengfu
  Admission Number: 2033457
  Class: DIT/04
*/
var express = require('express');
var router = express();

var userDB = require('../model/userDB');
var catDB = require('../model/categoryDB');
var gameDB = require('../model/gameDB');
var reviewDB = require('../model/reviewDB');
const jwt = require("jsonwebtoken");
const JWT_SECRET = require("../config.js");
const verifyToken = require("../auth/verifyToken");

const fileUpload = require('express-fileupload');
const fileType = require('file-type');
router.use(fileUpload({ createParentPath: true }));

var cors = require('cors');
router.options('*', cors());
router.use(cors());

var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());


//Filter Games
router.get("/games/filter/:data", (req, res) => {
    var { title, price, platform } = JSON.parse(req.params.data);

    const titleVerify = title == "";
    const priceVerify = price == "";
    const platformVerify = platform == "";

    gameDB.filterGames(title, price, platform, titleVerify, priceVerify, platformVerify, (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).send();
        } else {
            res.status(200).send(result);
        }
    });

});

//0
router.post("/login/", function (req, res) {
    var { email, password } = req.body;
    userDB.verify(
        email, password,
        (error, user) => {
            if (error) {
                res.status(500).send();
                return;
            }
            if (user === null) {
                res.status(401).send();
                return;
            }
            const payload = { user_id: user.userid, user_type: user.type };
            jwt.sign(payload, JWT_SECRET, { algorithm: "HS256" }, (error, token) => {
                if (error) {
                    console.log(error);
                    res.status(401).send();
                    return;
                } else {
                    console.log(token);
                    res.status(200).send({
                        token: token,
                        user_id: user.userid,
                        user_type: user.type,
                        user_name: user.username
                    });
                }
            })
        });
});

//1
router.get("/users", (req, res) => {
    userDB.getUsers((err, result) => {
        if (err) {
            console.log(err);
            res.status(500).json("Unknown error");
        } else {
            console.log(result);
            res.status(200).json(result);
        }
    })
});

//2
router.post("/users", (req, res) => {
    var { username, email, type, profile_pic_url } = req.body;

    userDB.postUser(username, email, type, profile_pic_url, (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).json("Unknown error");
        } else {
            console.log(result);
            if (result === -1) {
                res.status(422).json("The username,email or profile_pic_url has already existed!")
            } else {
                res.status(201).json({ "userid": result.insertId });
            }
        }
    });
});

//3
router.get("/users/:id/", (req, res) => {
    var id = req.params.id;

    if (isNaN(parseInt(id))) {
        res.status(422).json({ message: "Id '" + id + "' is not a number!" });
    } else {
        userDB.getUser(id, (err, result) => {
            if (err) {
                console.log(err);
                res.status(500).json("Unknown error");
            } else {
                console.log(result);
                if (result === -1) {
                    res.status(422).json("Cannot find the record!");
                } else {
                    res.status(200).json(result);
                }
            }
        })
    }
});

//4
router.post("/category", verifyToken, (req, res) => {
    var { catname, description } = req.body;

    if (req.decodedToken.user_type !== "Admin") {
        res.status(401).json("Only Admins can add a category!");
    } else {
        catDB.postCategory(catname, description, (err, result) => {
            if (err) {
                console.log(err);
                res.status(500).json("Unknown error");
            } else {
                console.log(result);
                if (result === -1) {
                    res.status(422).json("The category name " + catname + " already exists.");
                } else {
                    res.status(204).json();
                }
            }
        });
    }
});

//5
router.put("/category/:id/", (req, res) => {
    var { catname, description } = req.body;
    var id = req.params.id;

    if (isNaN(id)) {
        res.status(422).json("Category id '" + id + "' is not a number!");
    } else {
        catDB.updateCategory(catname, description, id, (err, result) => {
            if (err) {
                console.log(err);
                if (result === -1) {
                    res.status(422).json(err);
                } else {
                    res.status(500).json(err);
                }
            } else {
                console.log(result);
                res.status(204).json();
            }
        });
    }
});

//6
router.post("/game", verifyToken, async (req, res) => {
    var { title, description, price, platform, categories, year } = JSON.parse(req.body.details);

    if (req.decodedToken.user_type !== "Admin") {
        res.status(401).json("Only Admins can add a game!");
    } else {
        var check = false;
        var msg;
        var gamePic;

        if (req.files) {
            gamePic = req.files.gamePic;
            let type;
            try {
                if ((type = await fileType.fromBuffer(gamePic.data)).ext !== "jpg") {
                    msg = "Your image uploaded is not in jpg format!";
                    console.log(type);
                } else if ((gamePic.size > 1 * 1024 * 1024)) {
                    msg = "Your image size must be less than 1MB!";
                } else {
                    check = true;
                    console.log(`File ${gamePic.name} size ${gamePic.size} is uploaded`);
                }
            } catch (e) {
                console.log(e);
            }
        } else {
            check = "No file";
        }

        gameDB.postGame(title, description, price, platform, categories, year, check, (err, result) => {
            if (err) {
                console.log(err);
                res.status(500).json(err);
            } else {
                if (result == -10) {
                    console.log("File Not in JPG or File Too Big!");
                    res.status(413).json(msg);
                } else if (result === -1) {
                    res.status(422).json("The game title " + title + " has already existed!");
                } else {
                    try {
                        if (check) {
                            let temp = title.replace(" ", "_");
                            temp = temp.replace(":", "_");
                            temp = temp.replace("'", "_");
                            gamePic.mv('./public/' + temp + ".jpg");
                        }
                    } catch (error) {
                        console.log(error);
                    }
                    res.status(201).json({ "gameid": result });
                    console.log(result);
                }
            }
        });
    }
});

//7
router.get("/games/:platform", (req, res) => {
    var platform = req.params.platform;

    gameDB.getGamesByPlatform(platform, (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).json(err);
        } else {
            if (result === -1) {
                res.status(422).json("Cannot find the platform of " + platform + " !");
            } else {
                res.status(200).json(result);
            }
        }
    });
});

//8
router.delete("/game/:id", (req, res) => {
    var id = req.params.id;

    if (isNaN(id)) {
        res.status(422).json("ID '" + id + "' is not a number!");
    } else {
        gameDB.deleteGame(id, (err, result) => {
            if (err) {
                console.log(err);
                res.status(500).json("Unknown error");
            } else {
                console.log(result);
                if (result === -1) {
                    res.status(422).json("Cannot find the id of " + id + " !");
                } else {
                    res.status(204).json();
                }
            }
        });
    }
});

//9
router.put("/game/:id", (req, res) => {
    var id = req.params.id;
    var { title, description, price, platform, categoryid, year } = req.body;

    console.log(title);
    if (isNaN(id)) {
        res.status(422).json("ID '" + id + "' is not a number!");
    } else {
        gameDB.updateGame(title, description, price, platform, categoryid, year, id, (err, result) => {
            if (err) {
                if (result === -1) {
                    res.status(422).json(err);
                } else {
                    res.status(500).json(err);
                }
            } else {
                res.status(204).json();
            }
        });
    }
});

//10
router.post("/user/game/:gid/review/", verifyToken, (req, res) => {
    var uid = req.decodedToken.user_id;
    var gid = req.params.gid;

    var { content, rating } = req.body;

    if (req.decodedToken.user_type !== "Customer") {
        res.status(422).json("Only Customers can add a review!");
    } else {
        reviewDB.postReview(uid, gid, content, rating, (err, result) => {
            if (err) {
                console.log(err);
                res.status(500).json("Unknown error");
            } else {
                if (result === -1) {
                    res.status(422).json("GameId '" + gid + "' does not exist!");
                } else if (result === -2) {
                    res.status(422).json("UserId '" + uid + "' does not exist!");
                } else {
                    res.status(201).type('json').json({ "reviewid": result.insertId });
                }
            }
        });
    }
});

//11
router.get("/game/:id/review", (req, res) => {
    var gid = req.params.id;

    if (isNaN(gid)) {
        res.status(422).json("GameId '" + gid + "' is not a number!");
    } else {
        reviewDB.getReviews(gid, (err, result) => {
            if (err) {
                console.log(err);
                res.status(500).json("Unknown error");
            } else {
                console.log(result);
                if (result === -1) {
                    res.status(422).json("GameId '" + gid + "' does not exist!");
                } else if (result === -2) {
                    res.status(422).json("GameId '" + gid + "' does not have a review!");
                } else {
                    res.status(200).json(result);
                }
            }
        });
    }
});

//12
router.delete("/review/:id", (req, res) => {
    var reviewId = req.params.id;

    if (isNaN(reviewId)) {
        res.status(422).json(reviewId + " is not a number!");
    } else {
        reviewDB.deleteReview(reviewId, (err, result) => {
            if (err) {
                console.log(err);
                res.status(500).json("Unknown error");
            } else {
                console.log(result);
                if (result === 0) {
                    res.status(422).json("Cannot find the review with id " + reviewId + " !");
                } else {
                    res.status(200).json({ "AffectedRows": result });
                }
            }
        });
    }
});

//13
router.delete("/game/:gameid/category/:catid", (req, res) => {
    var gameid = req.params.gameid;
    var catid = req.params.catid;

    if (isNaN(gameid) || isNaN(catid)) {
        res.status(422).json("GameId or CategoryId is not a number!");
    } else {
        catDB.deleteGameCategory(gameid, catid, (err, result) => {
            if (err) {
                console.log(err);
                res.status(500).json(err);
            } else {
                console.log(result);
                if (result.affectedRows === 0) {
                    res.status(422).json("The the game with id 14 does not contain the category with cat id " + catid + " !");
                } else {
                    res.status(200).json({ "AffectedRows": result.affectedRows });
                }
            }
        });
    }
});

//14
router.put("/game/:gameid/image", (req, res) => {
    var gid = req.params.gameid;
    var { url } = req.body;

    if (isNaN(gid)) {
        res.status(422).json("GameId '" + gid + "' is not a number!");
    } else {
        gameDB.uploadImage(gid, url, (err, result) => {
            if (err) {
                if (result) {
                    res.status(422).json(result);
                } else {
                    console.log(err);
                    res.status(500).json("Unknown error");
                }
            } else {
                res.status(200).json({ "AffectedRows": result.affectedRows });
            }
        });
    }
});

//15
router.get("/gamesWithImage", (req, res) => {

    gameDB.getAllgamesWithimage((err, result) => {
        if (err) {
            console.log(err);
            res.status(500).json("Unknown error");
        } else {
            console.log(result);
            res.status(200).json(result);
        }
    });
});

//16
router.get("/platforms", (req, res) => {
    gameDB.getAllPlatforms((err, result) => {
        if (err) {
            console.log(err);
            res.status(500).json("Unknown error");
        } else {
            console.log(result);
            res.status(200).json(result)
        }
    });
});

//17
router.get("/categories", (req, res) => {
    catDB.getAllCategories((err, result) => {
        if (err) {
            res.status(500).json(err);
        } else {
            res.status(200).json(result);
        }
    });
});

//17 Get game by id
router.get("/game/:gameid", (req, res) => {
    var gameid = req.params.gameid;
    gameDB.getGameById(gameid, (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).json("Unknown error");
        } else {
            if (result === -1) {
                res.status(422).json();
            } else {
                res.status(200).json(result);
            }
        }
    });
});

router.get("/user/type", verifyToken, (req, res) => {
    var user_type = req.decodedToken.user_type;
    res.status(200).send(user_type);
});



module.exports = router;