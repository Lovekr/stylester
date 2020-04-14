var mongoose = require('mongoose');
require('../models/adminusers.js');
require('../models/token.js');
var AdminUser  = mongoose.model('AdminUser');
var Token  = mongoose.model('Token');
mongoose.set('useFindAndModify', false);
var async = require('async');
var crypto = require('crypto');

const { body, validationResult } = require('express-validator');


exports.loginAdminPost = async (req,res,next)=>
{
    try {
        const authTokens = {};

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
        res.status(422).json({ errors: errors.array() });
        return;
      }
        console.log(req.body);
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
                 return res.status(400).send({ message: 'Invalid Email/Password.' });
            }


            var authToken = new Token({ role: admin.role, token: crypto.randomBytes(16).toString('hex') });

            authTokens["token"] = authToken;

            return res.status(200).send({message:'Successfully loggedin',data:authTokens}); 
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