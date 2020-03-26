var express = require("express");
var router = express.Router();

var HotDealController = require('../controllers/hotdealController.js')
router
.post('/create_hotdeal', HotDealController.postHotDeal)
.get('/get_all_hotdeals', HotDealController.getAllHotDeals)
.post('/set_hotdeal_status', HotDealController.setHotDealStatus)
.get('/export_hotdeals', HotDealController.exportHotDeals);
module.exports = router;