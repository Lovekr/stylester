var express = require("express");
var router = express.Router();

var AdminUserController = require('../controllers/adminuserController.js');
router
.post('/loginadmin', AdminUserController.loginAdminPost)
.post('/signupadmin', AdminUserController.signupAdminPost)
.get('/getallusers', AdminUserController.getAllUsers)
.get('/getuserbyid/:id',AdminUserController.getUserId)
.post('/updateuserbyid',AdminUserController.updateUserById);

module.exports = router;