var mongoose = require('mongoose');
require('../models/stylepick.js');
var Stylepick  = mongoose.model('Stylepick');
mongoose.set('useFindAndModify', false);
var async = require('async');

exports.postStylepick = function (req,res,next) 
{
    try {
        var stylepickData = new Stylepick(req.body);

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