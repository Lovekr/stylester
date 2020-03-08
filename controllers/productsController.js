var csv = require('fast-csv');
var mongoose = require('mongoose');
require('../models/product.js');
var Product  = mongoose.model('Product');
var async = require('async');


exports.postProducts = function (req, res) {
	if (!req.files)
		return res.status(400).send('No files were uploaded.');
	
	var productFile = req.files.file;

	var products = [];

  //console.log(productFile);
		
	csv
	 .fromString(productFile.data, {
		 headers: true,
		 ignoreEmpty: true
	 })
	 .on("data", function(data){ 
		 
		 //console.log(data);
		 //products.push(data);
      //  data['_id'] = new mongoose.Types.ObjectId();



      var item = new Product(data);
      //console.log(item);
      item.save(function(error){
        if(error)
        {
          throw error;
        }
            }); 
	 })
	 .on("end", function(){
		 Product.create(products, function(err, documents) {
			if (err) throw err;
			
			res.send(products.length + ' products have been successfully uploaded.');
		 });
	 });
};


exports.getProducts = function(req, res, next) { 
  	var products = [];
  //console.log("wait");
    //Validate request parameters, queries using express-validator

    var pageNo = parseInt(req.query.pageNo);
    var size = parseInt(req.query.limit); 
    var query = {};
    if (pageNo < 0 || pageNo === 0) {
        response = { "error": true, "message": "invalid page number, should start with 1" };
        return res.json(response)
    }
    skip = size * (pageNo - 1)
    limit = size

    console.log(skip)
  
// function products_count() { Product.find().lean().count().sort({_id: 'asc'}).exec();
// }

    var countQuery = function(callback){
          Product.estimatedDocumentCount({}, function(err, count){
            if(err){ callback(err, null); }
            else{
                   callback(null, count);
                }
          });
    };

  var retrieveQuery = function(callback){
        Product.find().lean().skip(skip).limit(limit).sort({_id: 'asc'})
            .exec(function(err, doc){
                            if(err){ callback(err, null); }
                            else{
                            callback(null, doc);
                            }
                      });
    };

        //var products_list = Product.find().lean().skip(skip).limit(limit).sort({_id: 'asc'}).exec(function (err, productes) {});


async.parallel([countQuery, retrieveQuery], function(err, results){
   

       return  res.json({data: results[1], totalCount: results[0]});

    });

 //res.status(200).json({ status: 200, data: productes, message: "Succesfully Products Retrieved" });

//         var products_count = Product.find().lean().estimatedDocumentCount().sort({_id: 'asc'}).exec(function (err, count) {
       
//     return res.status(200).json({ status: 200, data: count, message: "Count" });
// });

//         return res.status(200).json({ status: 200, data: products_list, "page": pageNo, "limit": size, message: "Succesfully Users Retrieved" });
//     } catch (e) {
//         return res.status(400).json({ status: 400, message: e.message });
//     }
}


exports.setStatus = function(req,res,next)
{
  console.log(req);
}