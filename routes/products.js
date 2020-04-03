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

var ProductsController = require('../controllers/productsController.js')
router
.post('/importproducts', upload.single('myFile'), ProductsController.postProducts)
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