var csv = require('fast-csv');
var mongoose = require('mongoose');
require('../models/product.js');
var Product  = mongoose.model('Product');
var async = require('async');
mongoose.set('useFindAndModify', false);
const { Parser } = require('json2csv');
const fs = require('fs');
var path = require('path');




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

Product.updateOne(
     {_id: id}, 
     {'STATUS' : value, 'updated_at' : new Date()},
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

exports.getAllEnabledProducts = function(req,res,next)
{

    var products = [];
    var pageNo = parseInt(req.query.pageNo);
    var size = parseInt(req.query.limit); 
    var query = {};
    if (pageNo < 0 || pageNo === 0) {
        response = { "error": true, "message": "invalid page number, should start with 1" };
        return res.json(response)
    }
    skip = size * (pageNo - 1)
    limit = size

    var countEnabledDoc = function(callback){
          Product.countDocuments({STATUS:'enable'}, function(err, countEnable){
            if(err){ callback(err, null); }
            else{
                   callback(null, countEnable);
                }
          });
    };

    var retrieveQuery = function(callback){
        Product.find({STATUS:'enable'}).lean().skip(skip).limit(limit).sort({_id: 'asc'})
            .exec(function(err, doc){
                            if(err){ callback(err, null); }
                            else{
                            callback(null, doc);
                            }
                      });
    };

    async.parallel([retrieveQuery, countEnabledDoc], function(err, results){   

       return  res.json({data: results[0], enableCount:results[1]});

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
      //return res.status(200).json({ products });
      return  res.status(200).json({data: products});

    }

  });
}


exports.searchProducts = function(req,res,next)
{
  
  var queryvalue = req.query.searchtext;

  var pageNo = parseInt(req.query.pageNo); 

  var size = parseInt(req.query.limit); 

    if (pageNo < 0 || pageNo === 0) {
      response = { "error": true, "message": "invalid page number, should start with 1" };
      return res.json(response)
  }
  skip = size * (pageNo - 1);
  limit = size;

  var re = new RegExp(queryvalue, 'i');

    var getSearchResults = function(callback)
    {
      

      Product.find({STATUS:'enable'}).or([
        { 'PRODUCT_NAME': { $regex: re }},
        { 'CATEGORY': { $regex: re }},
        { 'SUB_CATEGORY': { $regex: re }},
        { 'SIZE': { $regex: re }},
        { 'COLOUR': { $regex: re }},
        { 'BRAND': { $regex: re }},
        { 'WEBSITE_NAME': { $regex: re }},
        { 'PATTERN': { $regex: re }},
        { 'MATERIAL': { $regex: re }},
        { 'OCCASION': { $regex: re }},
        { 'PRICE': { $regex: re }}]).lean().skip(skip).limit(limit).sort({_id: 'asc'}).exec(function(err, products) {
        if(err)
        { callback(err, null); }
        else{
            callback(null, products);
            }
      });
    };
    

    var getSearchCount = function(callback)
    {
        Product.countDocuments({STATUS:'enable'}).or([
          { 'PRODUCT_NAME': { $regex: re }},
          { 'CATEGORY': { $regex: re }},
          { 'SUB_CATEGORY': { $regex: re }},
          { 'SIZE': { $regex: re }},
          { 'COLOUR': { $regex: re }},
          { 'BRAND': { $regex: re }},
          { 'WEBSITE_NAME': { $regex: re }},
          { 'PATTERN': { $regex: re }},
          { 'MATERIAL': { $regex: re }},
          { 'OCCASION': { $regex: re }},
          { 'PRICE': { $regex: re }}]).lean().exec(function(err, count) 
          {
          if(err)
        { callback(err, null); }
        else{
            callback(null, count);
            }
      });
    };

  /* combine both query */


async.parallel([getSearchResults, getSearchCount], function(err, results){   

       return  res.json({data: results[0], totalCount: results[1]});

    });


}

exports.websiteList = function(req,res,next)
{
  Product.find().distinct('WEBSITE_NAME', function(error, list) {
    if (error!=null) {
      return res.status(500).json({ error });
    }
    else
    {
      return  res.status(200).json({data: list});
    }    
    });
}

exports.categoryList = function(req,res,next)
{
  Product.find().distinct('CATEGORY', function(error, list) {
     if (error!=null) {
      return res.status(500).json({ error });
    }
    else
    {
      return  res.status(200).json({data: list});
    }    
    });
}

exports.subCategoryList = function(req,res,next)
{
    Product.find().distinct('SUB_CATEGORY', function(error, list) {
     if (error!=null) {
      return res.status(500).json({ error });
    }
    else
    {
      return  res.status(200).json({data: list});
    }    
    });
}

exports.filterProduct = function(req,res,next)
{
  var pageNo = parseInt(req.query.pageNo); 

  var size = parseInt(req.query.limit); 

    if (pageNo < 0 || pageNo === 0) {
      response = { "error": true, "message": "invalid page number, should start with 1" };
      return res.json(response)
  }
  skip = size * (pageNo - 1);
  limit = size;

  var query = {}

  var query = {$and:[{GENDER:{$regex: req.query.gender, $options: 'i'}},
                    {WEBSITE_NAME:{$regex: req.query.website, $options: 'i'}},
                    {CATEGORY:{$regex: req.query.category, $options: 'i'}},
                    {SUB_CATEGORY:{$regex: req.query.sub_category, $options: 'i'}}]}

    var query_enabled = {$and:[{GENDER:{$regex: req.query.gender, $options: 'i'}},
                    {WEBSITE_NAME:{$regex: req.query.website, $options: 'i'}},
                    {CATEGORY:{$regex: req.query.category, $options: 'i'}},
                    {SUB_CATEGORY:{$regex: req.query.sub_category, $options: 'i'}},
                    {STATUS:{$regex: 'enable', $options: 'i'}}]}

  getFilterResults = function(callback)
  {
      Product.find(query).lean().skip(skip).limit(limit).sort({_id: 'asc'}).exec(function(error, product) {
      if(error)
        { callback(error, null); }
      else{callback(null, product);}  
      });
  }

  getFilterCount = function(callback)
  {
     Product.countDocuments(query).lean().exec(function(error, totalCount) {
      if(error)
        { callback(error, null); }
      else{callback(null, totalCount);}  
      });
  }

  getFilterCountEnable = function(callback)
  {
     Product.countDocuments(query_enabled).lean().exec(function(error, enableCount) {
      if(error)
        { callback(error, null); }
      else{callback(null, enableCount);}  
      });
  }


async.parallel([getFilterResults, getFilterCount, getFilterCountEnable], function(err, results){   
       return  res.json({data: results[0], totalCount: results[1], enableCount: results[2]});
    });
}


exports.enabledDetails = function(req,res,next)
{
  Product.aggregate([ 
        { $match : { STATUS : "enable" } },
        {
        $group: {
        _id: {"SUB_CATEGORY":'$SUB_CATEGORY',"CATEGORY":"$CATEGORY","WEBSITE_NAME":"$WEBSITE_NAME"}, //$region is the column name in collection 
        count: {$sum: 1}
        }
        }
        ], function (err, result) {
        if (err) {
         return res.status(500).json({ err });
        } else {
          
        return res.status(200).json({ result });
        }
        });

}