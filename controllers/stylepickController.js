var mongoose = require('mongoose');
require('../models/stylepick.js');
var Stylepick  = mongoose.model('Stylepick');
mongoose.set('useFindAndModify', false);
var async = require('async');
const fs = require('fs-extra');


exports.postStylepick = function (req,res,next) 
{
    try {
        var img = fs.readFileSync(req.file.path);
        var encode_image = img.toString('base64');
        // Define a JSONobject for the image attributes for saving to database
        
        var finalImg = {
            image:  new Buffer.from(encode_image, 'base64'),
            contentType: req.file.mimetype,
            imagepath:req.file.path      
        };

        var stylepickData = new Stylepick({
            title:req.body.title,
            sub_title:req.body.sub_title,
            description:req.body.description,
            image_title:req.body.image_title,
            price:req.body.price,
            img: finalImg,
            producturl:req.body.producturl.split(",")});

        stylepickData.save()
            .then()
            .catch(err => console.log(err));
        return res.status(200).json({ status: 200, message: "Succesfully Post Saved" });
    } catch (e) {

        return res.status(400).json({ status: 400, message: e.message });
    }
}

exports.getAllStylePicks = function(req,res,next)
{
    try
    {
        var stylepicks = function(callback)
        {
            Stylepick.find().lean().sort({_id: 'asc'}).exec(function(err, stylepicks){
                            if(err)
                            { 
                                callback(err, null);
                            }
                            else
                            {
                                callback(null, stylepicks);
                            }
                      });
        }



        var stylepickscount = function(callback)
        {
            Stylepick.countDocuments().lean().sort({_id: 'asc'}).exec(function(err, stylepicks_count){
                            if(err)
                            { 
                                callback(err, null);
                            }
                            else
                            {
                                callback(null, stylepicks_count);
                            }
                      });
        }

        async.parallel([stylepicks, stylepickscount], function(err, results){   
       return  res.json({data: results[0], totalCount: results[1]});
    });
        
    }
    catch(e)
    {
        return res.status(400).json({ status: 400, message: e.message });
    }
}

exports.setStylepickStatus = function(req,res,next)
{
    var value = req.body.value;
    var id = req.body._id;

    Stylepick.updateOne(
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

exports.exportStylepicks = function(req,res,next)
{
    var status = req.query.value; 
    Stylepick.find({STATUS:status}).lean().sort({_id: 'asc'}).exec(function (err, stylepicks) {
   
    if (err!=null) {
      return res.status(500).json({ err });
    }
    else
    {
      //return res.status(200).json({ products });
      return  res.status(200).json({data: stylepicks});

    }

  });
}

exports.getEnableStylepicks = function(req,res,next)
{
    try {
        // console.log("hello");
      
            Stylepick.find({'STATUS' : 'enable'}).lean().limit(4).sort({_id: 'asc'}).exec(function(err, stylepicks){
            if(err)
            { 
                return res.status(500).json({ err });
            }
            else
            {
               
                return  res.status(200).json({data: stylepicks});
            }
            });
        
    }
     catch (e) {
         return res.status(400).json({ status: 400, message: e.message });
    }
}