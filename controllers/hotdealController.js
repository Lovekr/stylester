var mongoose = require('mongoose');
require('../models/hotdeal.js');
var Hotdeal  = mongoose.model('Hotdeal');
const fs = require('fs-extra');
mongoose.set('useFindAndModify', false);
var async = require('async');




exports.postHotDeal = function (req,res,next) 
{
	var img = fs.readFileSync(req.file.path);
  var encode_image = img.toString('base64');
 // Define a JSONobject for the image attributes for saving to database
 
  var finalImg = {
      image:  new Buffer.from(encode_image, 'base64'),
      contentType: req.file.mimetype,
      imagepath:req.file.path      
   };


    try {
        var hotdealData = new Hotdeal({
            title:req.body.title,
            sub_title:req.body.sub_title,
            description:req.body.description,
            image_title:req.body.image_title,
            discount_percentage:req.body.discount_percentage,
            img: finalImg,
            producturl:req.body.producturl.split(",")});

        hotdealData.save()
            .then()
            .catch(err => console.log(err));
        return res.status(200).json({ status: 200, message: "Succesfully Hot Deal Saved" });
    } catch (e) {

        return res.status(400).json({ status: 400, message: e.message });
    }
}

exports.getAllHotDeals = function(req,res,next)
{
    try
    {
        var hotdeals = function(callback)
        {
            Hotdeal.find().lean().sort({_id: 'asc'}).exec(function(err, hotdeals){
                            if(err)
                            { 
                                callback(err, null);
                            }
                            else
                            {
                                callback(null, hotdeals);
                            }
                      });
        }



        var hotdealscount = function(callback)
        {
            Hotdeal.countDocuments().lean().sort({_id: 'asc'}).exec(function(err, hotdeal_count){
                            if(err)
                            { 
                                callback(err, null);
                            }
                            else
                            {
                                callback(null, hotdeal_count);
                            }
                      });
        }

        async.parallel([hotdeals, hotdealscount], function(err, results){   
       return  res.json({data: results[0], totalCount: results[1]});
    });
        
    }
    catch(e)
    {
        return res.status(400).json({ status: 400, message: e.message });
    }
}


exports.setHotDealStatus = function(req,res,next)
{
    var value = req.body.value;
    var id = req.body._id;

    Hotdeal.updateOne(
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
            res.status(200).json({ status: 200, message: 'Updated Successfully' });
         }
         
       });
}


exports.exportHotDeals = function(req,res,next)
{
    var status = req.query.value; console.log(status);
    Hotdeal.find({STATUS:status}).lean().sort({_id: 'asc'}).exec(function (err, hotdeals) {
   
    if (err!=null) {
      return res.status(500).json({ err });
    }
    else
    {       
        console.log(hotdeals);
      //return res.status(200).json({ products });
      return  res.status(200).json({data: hotdeals});

    }

  });
}