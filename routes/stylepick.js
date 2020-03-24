var express = require("express");
var router = express.Router();

var StylepickController = require('../controllers/stylepickController.js')
router
.post('/create_stylepick', StylepickController.postStylepick)
.get('/get_all_stylepicks', StylepickController.getAllStylePicks)
.post('/update_stylepick_status', StylepickController.setStylepickStatus)
.get('/export_stylepicks', StylepickController.exportStylepicks)
;
module.exports = router;