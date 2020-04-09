var express = require("express");
var router = express.Router();

var BloggerController = require('../controllers/bloggerController.js')
router
.post('/login_blogger',BloggerController.validate('loginBlogger'), BloggerController.loginPost)
.post('/signup_blogger',BloggerController.validate('createBlogger'), BloggerController.signupPost)
.post('/requestblogger',BloggerController.validate('requestBlogger'), BloggerController.requestBlogger)
.get('/confirmation_blogger/:token',BloggerController.confirmationPost)
.get('/getblogger',BloggerController.getBlogger)
.get('/getbloggerid/:id',BloggerController.getBloggerId)
.post('/setbloggerstatus',BloggerController.setBloggerStatus);

module.exports = router;