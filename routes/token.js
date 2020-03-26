var express = require("express");
var router = express.Router();

var TokenController = require('../controllers/tokenController.js')
router
.post('/resend', TokenController.resendTokenPost);
module.exports = router;