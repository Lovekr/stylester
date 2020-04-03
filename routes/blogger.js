var express = require("express");
var router = express.Router();

var BloggerController = require('../controllers/bloggerController.js')
router
.post('/login_blogger',BloggerController.validate('loginBlogger'), BloggerController.loginPost)
.post('/signup_blogger',BloggerController.validate('createBlogger'), BloggerController.signupPost)
.get('/confirmation_blogger/:token',BloggerController.confirmationPost);

module.exports = router;