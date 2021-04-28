/*
  Name: Wu Zengfu
  Admission Number: 2033457
  Class: DIT/04
*/
const express = require('express');

require('dotenv').config();

var hostname = process.env.HOST;
var port = process.env.PORT;

var app = express();

app.use(function (req, res, next) {
    console.log(req.url);
    console.log(req.method);
    console.log(req.path);
    console.log(req.query.id);

    if (req.method != "GET") {
        res.type('.html');
        var msg = "<html><body>This server only serves web pages with GET!</body></html>";
        res.end(msg);
    } else {
        next();
    }
});


app.use(express.static(__dirname + "/public"));


app.listen(port, hostname, function () {

    console.log(`FrontEnd Server hosted at http://${hostname}:${port}`);
});
