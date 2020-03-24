var express = require("express");
var router = express.Router();

var HotDealController = require('../controllers/hotdealController.js')
router
.post('/create_hotdeal', HotDealController.postHotDeal)
.get('/get_all_hotdeals', HotDealController.getAllHotDeals);
module.exports = router;