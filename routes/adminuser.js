var express = require("express");
var router = express.Router();

var AdminUserController = require('../controllers/adminuserController.js');
router
.post('/loginadmin', AdminUserController.loginAdminPost)
.post('/signupadmin', AdminUserController.signupAdminPost);

module.exports = router;