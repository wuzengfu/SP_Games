/*
  Name: Wu Zengfu
  Admission Number: 2033457
  Class: DIT/04
*/
const router = require('./controller/router.js');

require('dotenv').config();

const hostname = process.env.HOST;
const port = process.env.PORT;

var express = require('express');
router.use(express.static(__dirname + "/public"));

const server = router.listen(port, function () {
  console.log(`Backend Server Hosted at http://${hostname}:${port}`);
});
