var express = require("express");
var router = express.Router();

var UserController = require('../controllers/userController.js')
router
.post('/login',UserController.validate('loginUser'), UserController.loginPost)
.post('/signup',UserController.validate('createUser'), UserController.signupPost)
.get('/confirmation/:token',UserController.confirmationPost);

module.exports = router;