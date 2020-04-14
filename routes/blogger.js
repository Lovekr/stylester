var express = require("express");
var router = express.Router();
const multer = require('multer');
const fs = require('fs-extra');


var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads')
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now())
  }
});

var upload = multer({ storage: storage });

var BloggerController = require('../controllers/bloggerController.js')
router
.post('/login_blogger',BloggerController.validate('loginBlogger'), BloggerController.loginPost)
.post('/signup_blogger',BloggerController.validate('createBlogger'), BloggerController.signupPost)
.post('/requestblogger', upload.array('myFile',4), BloggerController.requestBlogger)
.get('/confirmation_blogger/:token',BloggerController.confirmationPost)
.get('/getblogger',BloggerController.getBlogger)
.get('/getbloggerid/:id',BloggerController.getBloggerId)
.post('/setbloggerstatus',BloggerController.setBloggerStatus)
.get('/getapprovedbloggerid',BloggerController.getApprovedBlogger);

module.exports = router;