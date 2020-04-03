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

var StylepickController = require('../controllers/stylepickController.js')
router
.post('/create_stylepick', upload.single('myFile'), StylepickController.postStylepick)
.get('/get_all_stylepicks', StylepickController.getAllStylePicks)
.post('/update_stylepick_status', StylepickController.setStylepickStatus)
.get('/export_stylepicks', StylepickController.exportStylepicks);

module.exports = router;