var express = require("express");
var router = express.Router();

var ProductsController = require('../controllers/productsController.js')
router
.post('/importproducts', ProductsController.postProducts)
.get('/getproducts', ProductsController.getProducts)
.post('/setproductstatus', ProductsController.setStatus)
.get('/getallenabledproducts', ProductsController.getAllEnabledProducts)
.get('/exportcsv', ProductsController.exportproducts)
.get('/searchproducts', ProductsController.searchProducts)
.get('/websitelist',ProductsController.websiteList)
.get('/categorylist',ProductsController.categoryList)
.get('/subcategorylist',ProductsController.subCategoryList)
.get('/filterproduct',ProductsController.filterProduct)
.get('/enableddetails',ProductsController.enabledDetails)
;
module.exports = router;