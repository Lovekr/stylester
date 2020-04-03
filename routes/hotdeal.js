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
var HotDealController = require('../controllers/hotdealController.js')
router
// .post('/create_hotdeal', HotDealController.postHotDeal)
.get('/get_all_hotdeals', HotDealController.getAllHotDeals)
.post('/set_hotdeal_status', HotDealController.setHotDealStatus)
.get('/export_hotdeals', HotDealController.exportHotDeals);

router.post('/create_hotdeal', upload.single('myFile'), HotDealController.postHotDeal);
module.exports = router;


