var express = require("express");
var router = express.Router();

var StylepickController = require('../controllers/stylepickController.js')
router
.post('/create_stylepick', StylepickController.postStylepick)
.get('/get_all_stylepicks', StylepickController.getAllStylePicks);
module.exports = router;