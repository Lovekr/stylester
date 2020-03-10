var csv = require('fast-csv');
var mongoose = require('mongoose');
require('../models/product.js');
var Product  = mongoose.model('Product');
var async = require('async');
mongoose.set('useFindAndModify', false);
const { Parser } = require('json2csv');
const fs = require('fs');



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

        var countEnabledDoc = function(callback){
          Product.countDocuments({STATUS:'enable'}, function(err, countEnable){
            if(err){ callback(err, null); }
            else{
                   callback(null, countEnable);
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


async.parallel([countQuery, retrieveQuery, countEnabledDoc], function(err, results){   

       return  res.json({data: results[1], totalCount: results[0], enableCount:results[2]});

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
  //console.log(req.body.value);
  var value = req.body.value;
  var id = req.body._id;
  //Product.findByIdAndUpdate(_id:id, { $set: { 'STATUS': value }}, { new: true }, { useFindAndModify: false });
console.log(id);
Product.updateOne(
     {_id: id}, 
     {'STATUS' : value },
     {multi:true}, 
       function(err, numberAffected){ 
         if(err) 
         {
           res.status(400).json({ status: 400, message: err.message });
         }
         if(numberAffected)
         {
            // Product.find({ "STATUS": { $exists: false, $ne: null } }).lean().limit(4).sort({_id: 'asc'}).exec(function(err, doc){
            //                 if(err){ callback(err, null); }
            //                 else{
            //                    res.status(200).json({ status: 200, data: doc, message: "Succesfully Products Retrieved" });

            //                 }
            //           });
    
            res.status(200).json({ status: 200, message: 'Updated Successfully' });
         }
         
       });
}

exports.getAllProducts = function(req,res,next)
{
    var productlist = [];
    const initialTime = Date.now();  
    let cont = 0;

    const stream = Product.find().lean().cursor();
    stream.on('data', (data) => { productlist.push(data); });

    stream.on('close', () => {
        res.send({data:productlist});
    const totalTime = Date.now() - initialTime;
    console.log(`Execution ended. Number of elements: ${cont}. Elapsed time: ${(totalTime / 1000)} seconds`);
    
    });
}

exports.exportproducts =  function (req, res, next) {
 
  var status = req.query.value; 
  const fields = [
	'SR_NO',
	'STYLSTER_ID',
	'PRODUCT_NAME',
	'CATEGORY',
	'SUB_CATEGORY',
	'SUPER_SUB_CATEGORY',
	'IMAGE_LINK',
	'SIZE',
	'COLOUR',
	'BRAND',
	'WEBSITE_NAME',
	'PATTERN',
	'MATERIAL',
	'OCCASION',
	'PRICE',
	'OLD_PRICE',
	'DISCOUNT_PERCENTAGE',
	'WEBSITE_LINK',
	'DESCRIPTION',
	'STORE_PRODUCT_ID',
	'GENDER',
	'FIT',
	'LENGTH',
	'NECK',
	'SLEEVE_LENGTH',
	'COLLAR',
	'TECHNOLOGY',
	'TYPE',
	'SPORT',
	'MULTI_PACK_SET',
	'FEATURES',
	'SLEEVE_STYLE',
	'TRANSPARENCY',
	'DISTRESS',	
	'FADE',
	'SHADE',
	'WAIST_RISE',
	'PADDING',
	'SEAM',
	'STRAPS',
	'WIRING',
	'HEEL_HEIGHT',
	'HEEL_TYPE',
	'EFFECT',
	'APPLICATION',
	'INGREDIENT',
	'SPECIALITY',
	'FINISH',
	'PREFERENCE',
	'FORMULATION',
	'COVERAGE',
	'SKIN_TYPE',
	'CONCERN',
	'STATUS'];

  const opts = { fields };


  Product.find({STATUS:status}).lean().sort({_id: 'asc'}).exec(function (err, products) {
   
    if (err!=null) {
      return res.status(500).json({ err });
    }
    else
    {
      let csv;
      try {
        const parser = new Parser(opts);
        const csv = parser.parse(products);
        console.log(csv);
      } catch (err) {console.log("csv");
        return res.status(500).json({ err });
      }

      const dateTime = 'sample';
      const filePath = path.join(__dirname, "..", "public", "files", "csv-" + dateTime + ".csv");

      fs.writeFile(filePath, csv, function (err) {
        if (err) {
          return res.json(err).status(500);
        }
        else {
          setTimeout(function () {
            fs.unlinkSync(filePath); // delete this file after 30 seconds
          }, 30000)
          return res.json("/files/csv-" + dateTime + ".csv");
        }
      });
      
    }

  });
}
