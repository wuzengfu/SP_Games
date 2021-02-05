/* 
  Name: Wu Zengfu
  Admission Number: 2033457
  Class: DIT/04
*/
const router = require('./controller/router.js');
const hostname = 'localhost';
const port = 3001;

var express = require('express');
router.use(express.static(__dirname + "/public"));

const server = router.listen(port, function () {
  console.log(`Backend Server Hosted at http://${hostname}:${port}`);
});