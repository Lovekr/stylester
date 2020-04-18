var mongoose = require('mongoose');
require('../models/adminusers.js');
require('../models/token.js');
var AdminUser  = mongoose.model('AdminUser');
var Token  = mongoose.model('Token');
mongoose.set('useFindAndModify', false);
var async = require('async');
var crypto = require('crypto');
var jwt = require('jsonwebtoken');
require('dotenv').config()

const { body, validationResult } = require('express-validator');


exports.loginAdminPost = async (req,res,next)=>
{
  //console.log(`${process.env.SECRET_KEY}`); 
    try {
        const authTokens = {};

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
        res.status(422).json({ errors: errors.array() });
        return;
      }
        
        const { username, password } = req.body;

        const hashedPassword = getHashedPassword(password);


        await AdminUser.findOne({ username : username, password : password}, function (err, admin)
        {
            if(err)
            {
                return res.status(500).send({ msg: err.message });
            }
            if(!admin)
            {
                 return res.status(400).send({ msg: 'Invalid Email/Password.' });
            }

           
            var token = jwt.sign({ role: admin.role }, `${process.env.SECRET_KEY}`);

            

            return res.status(200).send({token}); 
        });

       

    } catch (error) {
        return next(error)
    }
}





exports.signupAdminPost = async (req, res, next) => {
   try {
      const errors = validationResult(req); // Finds the validation errors in this request and wraps them in an object with handy functions

      if (!errors.isEmpty()) {
        res.status(422).json({ errors: errors.array() });
        return;
      }

      const { username, password, role } = req.body

      await AdminUser.findOne({ username : username}, function (err, admin) 
      {
           // Make sure user doesn't already exist
            if (admin) return res.status(400).send({ msg: 'The username you have entered is already associated with another account.' });

            
            const hashedPassword = getHashedPassword(password);
            const newAdminUser =  AdminUser.create({username, password, role },(err,data)=>
            {
                if(err)
                {
                    return res.status(500).send({ msg: err.message });
                }

                // var token = new Token({ role: data.role, token: crypto.randomBytes(16).toString('hex') });
                // token.save(function (err) {
                //     if (err) { return res.status(500).send({ msg: err.message }); }

                // });

                return res.status(200).send({ msg: "User Added Successfully." });
            });
      });
     
   } catch(err) {
     return next(err)
   }
}


exports.getAllUsers = function(req,res,next)
{
    try
    {
        var users = function(callback)
        {
            AdminUser.find().lean().sort({_id: 'asc'}).exec(function(err, users){
                            if(err)
                            { 
                                callback(err, null);
                            }
                            else
                            {
                                callback(null, users);
                            }
                      });
        }



        var userscount = function(callback)
        {
            AdminUser.countDocuments().lean().sort({_id: 'asc'}).exec(function(err, users_count){
                            if(err)
                            { 
                                callback(err, null);
                            }
                            else
                            {
                                callback(null, users_count);
                            }
                      });
        }

        async.parallel([users, userscount], function(err, results){   
       return  res.json({data: results[0], totalCount: results[1]});
    });
        
    }
    catch(e)
    {
        return res.status(400).json({ status: 400, message: e.message });
    }
}



exports.getUserId = async (req,res,next)=>
{
    try 
    {
        var id = req.params.id;

        await AdminUser.findById(id).lean(1).sort({_id: 'asc'}).exec(function(err, user){
            if(err)
            { 
                return res.status(500).send({ msg: err.message });
            }
            else
            {
               return res.status(200).send({data:user});
            }
        });
        
    } catch (e) 
    {
        return res.status(400).json({ status: 400, message: e.message });
    }
};


exports.updateUserById = async (req,res,next)=>
{
    try {

      await AdminUser.updateOne({_id: req.body._id}, req.body, {upsert: true}, function(err,user){
        if(err)
        { 
            return res.status(500).send({ msg: err.message });
        }
        else
        {
            return res.status(200).send({msg:"User Updated Successfully!"});
        }
      });

    } catch (error) {
         return res.status(400).json({ status: 400, message: error.message });
    }
}



exports.validate = (method) => {
  switch (method) {
    case 'createUser': {
     return [        
        body('username', 'Email is not valid').exists().isEmail(),       
        body('password','Password must be at least 6 characters long').isLength({ min: 6 })
       ]   
    }
        case 'loginUser': {
     return [ 
        body('username', 'Email is not empty').notEmpty(),
        body('username', 'Email is not valid').exists().isEmail(),
        body('password','Password must be at least 6 characters long').isLength({ min: 6 })
       ]   
    }
  }
}

const getHashedPassword = (password) => {
    const sha256 = crypto.createHash('sha256');
    const hash = sha256.update(password).digest('base64');
    return hash;
}


const generateAuthToken = () => {
    return crypto.randomBytes(30).toString('hex');
}