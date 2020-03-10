var express = require("express");
var router = express.Router();

var ProductsController = require('../controllers/productsController.js')
router
.post('/importproducts', ProductsController.postProducts)
.get('/getproducts', ProductsController.getProducts)
.post('/setproductstatus', ProductsController.setStatus)
.get('/getallproducts', ProductsController.getAllProducts)
.get('/exportcsv', ProductsController.exportproducts);
module.exports = router;