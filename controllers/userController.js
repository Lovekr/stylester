var mongoose = require('mongoose');
require('../models/user.js');
require('../models/token.js');
var User  = mongoose.model('User');
var Token  = mongoose.model('Token');
mongoose.set('useFindAndModify', false);
var async = require('async');
var crypto = require('crypto');
var nodemailer = require('nodemailer');
const { body, validationResult } = require('express-validator');


exports.loginPost = async (req,res,next)=>
{
    try {
        const authTokens = {};

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
        res.status(422).json({ errors: errors.array() });
        return;
      }
        console.log(req.body);
        const { email, password } = req.body;

        const hashedPassword = getHashedPassword(password);


        await User.findOne({ email : email, password : hashedPassword}, function (err, user)
        {
            if(err)
            {
                return res.status(500).send({ msg: err.message });
            }
            if(!user)
            {
                 return res.status(400).send({ message: 'Invalid Email/Password.' });
            }
            if(user.isVerified===false)
            {
                return res.status(400).send({ message: 'The email address you have entered is not verified.' });
            }

            const authToken = generateAuthToken();

            authTokens["token"] = authToken;

            authTokens["id"] = user.id;

            authTokens["name"] = user.name;

            authTokens["email"] = user.email;

            return res.status(200).send({message:'Successfully loggedin',data:authTokens}); 
        });

       

    } catch (error) {
        return next(error)
    }
}





exports.signupPost = async (req, res, next) => {
   try {
      const errors = validationResult(req); // Finds the validation errors in this request and wraps them in an object with handy functions

      if (!errors.isEmpty()) {
        res.status(422).json({ errors: errors.array() });
        return;
      }

      const { name, email, password, gender, isVerified } = req.body

      await User.findOne({ email : email}, function (err, user) 
      {
           // Make sure user doesn't already exist
            if (user) return res.status(400).send({ msg: 'The email address you have entered is already associated with another account.' });

            
            const hashedPassword = getHashedPassword(password);
            const newUser =  User.create({name, gender, email, isVerified, password : hashedPassword},(err,data)=>
            {
                if(err)
                {
                    return res.status(500).send({ msg: err.message });
                }

                var token = new Token({ _userId: data._id, token: crypto.randomBytes(16).toString('hex') });
                token.save(function (err) {
                    if (err) { return res.status(500).send({ msg: err.message }); }

                    // Send the email
                    var transporter = nodemailer.createTransport({
                         host: 'smtp.gmail.com',
                        port: 587,
                        secure: false,
                        requireTLS: true,
                        auth: {
                                user: 'ajithjbdvt@gmail.com',
                                pass: 'Silvermoon@123'
                            }
                        });
                       
                    var mailOptions = 
                    { 
                        from: 'no-reply@yourwebapplication.com', 
                        to: data.email, 
                        subject: 'Account Verification Token', 
                        text: 'Hello,\n\n' + 'Please verify your account by clicking the link: \nhttp:\/\/' + req.headers.host + '\/confirmation\/' + token.token + '.\n' 
                    };
                    
                    transporter.sendMail(mailOptions, function (err) {
                        if (err) { return res.status(500).send({ msg: err.message }); }
                        res.status(200).send('A verification email has been sent to ' + data.email + '.');
                    });
                });
            });
      });
     
   } catch(err) {
     return next(err)
   }
}

exports.confirmationPost = async (req, res, next) =>
{
    try 
    {
        token_id = req.params.token;
        // Find a matching token
        await Token.findOne({ token: token_id }, function (err, token) {      
            if (!token) return res.status(400).send({ type: 'not-verified', msg: 'We were unable to find a valid token. Your token my have expired.' });
            // If we found a token, find a matching user
            //console.log(token._userId);
            User.findOne({ _id: token._userId }, function (err, user) {
                if (!user) return res.status(400).send({ msg: 'We were unable to find a user for this token.' });
                if (user.isVerified) return res.status(400).send({ type: 'already-verified', msg: 'This user has already been verified.' });

                // Verify and save the user
                user.isVerified = true;
                user.save(function (err) {
                    if (err) { return res.status(500).send({ msg: err.message }); }
                    res.status(200).send("The account has been verified. Please log in.");
                });
            });
        });    
    } catch (error) {
        return next(error)
    }
};


exports.validate = (method) => {
  switch (method) {
    case 'createUser': {
     return [ 
        body('name', 'Name should not be empty').notEmpty(),
        body('email', 'Email is not valid').exists().isEmail(),
        body('gender', 'Gender should not be empty').optional(),
        body('isVerified','Mail Verification').optional(),
        body('password','Password must be at least 6 characters long').isLength({ min: 6 })
       ]   
    }
        case 'loginUser': {
     return [ 
        body('email', 'Email is not empty').notEmpty(),
        body('email', 'Email is not valid').exists().isEmail(),
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