var mongoose = require('mongoose');
require('../models/blogger.js');
require('../models/token.js');
var Blogger  = mongoose.model('Blogger');
var RequestBlogger = mongoose.model('RequestBlogger');
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


        await Blogger.findOne({ email : email, password : hashedPassword}, function (err, blogger)
        {
            if(err)
            {
                return res.status(500).send({ msg: err.message });
            }
            if(!blogger)
            {
                 return res.status(400).send({ message: 'Invalid Email/Password.' });
            }
            if(blogger.isVerified===false)
            {
                return res.status(400).send({ message: 'The email address you have entered is not verified.' });
            }

            const authToken = generateAuthToken();

            authTokens["token"] = authToken;

            authTokens["id"] = blogger.id;

            authTokens["name"] = blogger.name;

            authTokens["email"] = blogger.email;

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

      await Blogger.findOne({ email : email}, function (err, blogger) 
      {
           // Make sure user doesn't already exist
            if (blogger) return res.status(400).send({ msg: 'The email address you have entered is already associated with another account.' });

            
            const hashedPassword = getHashedPassword(password);
            const newBlogger =  Blogger.create({name, gender, email, isVerified, password : hashedPassword},(err,data)=>
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
            Blogger.findOne({ _id: token._userId }, function (err, blogger) { console.log(blogger);
                if (!blogger) return res.status(400).send({ msg: 'We were unable to find a user for this token.' });
                if (blogger.isVerified) return res.status(400).send({ type: 'already-verified', msg: 'This user has already been verified.' });

                // Verify and save the user
                blogger.isVerified = true;
                blogger.save(function (err) {
                    if (err) { return res.status(500).send({ msg: err.message }); }
                    res.status(200).send("The account has been verified. Please log in.");
                });
            });
        });    
    } catch (error) {
        return next(error)
    }
};

exports.requestBlogger = async (req,res,next)=>
{
    try 
    {
        const errors = validationResult(req); // Finds the validation errors in this request and wraps them in an object with handy functions

      if (!errors.isEmpty()) {
        res.status(422).json({ errors: errors.array() });
        return;
      }

      const { name, username, email, phone, facebookprofile, facebooklikes, twitterprofile, twitterlikes, instagramprofile, instagramlikes, pinterestprofile, pinterestlikes, location } = req.body

      await RequestBlogger.findOne({ email : email}, function (err, blogger)
      {
          // Make sure user doesn't already exist
            if (blogger) return res.status(400).send({ msg: 'The email address you have entered is already associated with another account.' });
            
            var status = 'pending';
            const newRequesBlogger = RequestBlogger.create({name, username, email, phone, facebookprofile, facebooklikes, twitterprofile, twitterlikes, instagramprofile, instagramlikes, pinterestprofile, pinterestlikes, location, status},(err,data)=>{
                if(err)
                {
                    return res.status(500).send({ msg: err.message });
                }

                return res.status(200).send('Blogger request accepted.');
            });
      });

    } catch (error) 
    {
        
    }
};

exports.getBlogger = async (req,res,next)=>{
     try
    {
        var bloggers = function(callback)
        {
            RequestBlogger.find().lean().sort({_id: 'asc'}).exec(function(err, bloggers){
                            if(err)
                            { 
                                callback(err, null);
                            }
                            else
                            {
                                callback(null, bloggers);
                            }
                      });
        }



        var blogger_count = function(callback)
        {
            RequestBlogger.countDocuments().lean().sort({_id: 'asc'}).exec(function(err, blogger_count){
                            if(err)
                            { 
                                callback(err, null);
                            }
                            else
                            {
                                callback(null, blogger_count);
                            }
                      });
        }

        async.parallel([bloggers, blogger_count], function(err, results){   
       return  res.json({data: results[0], totalCount: results[1]});
    });
        
    }
    catch(e)
    {
        return res.status(400).json({ status: 400, message: e.message });
    }
};


exports.getBloggerId = async (req,res,next)=>
{
    try 
    {
        var id = req.params.id;

        await RequestBlogger.findById(id).lean(1).sort({_id: 'asc'}).exec(function(err, blogger){
            if(err)
            { 
                return res.status(500).send({ msg: err.message });
            }
            else
            {
               return res.status(200).send({data:blogger});
            }
        });
        
    } catch (e) 
    {
        return res.status(400).json({ status: 400, message: e.message });
    }
};

exports.setBloggerStatus = async(req,res,next)=>
{
    var status = req.body.status;
    var id = req.body._id;
    var reason = req.body.reason;
  //Product.findByIdAndUpdate(_id:id, { $set: { 'STATUS': value }}, { new: true }, { useFindAndModify: false });

    await RequestBlogger.updateOne(
     {_id: id}, 
     {'status' : status, 'reject_reason' : reason, 'updated_at' : new Date()},
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


exports.validate = (method) => {
  switch (method) {
    case 'createBlogger': {
     return [ 
        body('name', 'Name should not be empty').notEmpty(),
        body('email', 'Email is not valid').exists().isEmail(),
        body('gender', 'Gender should not be empty').optional(),
        body('isVerified','Mail Verification').optional(),
        body('password','Password must be at least 6 characters long').isLength({ min: 6 })
       ]   
    }
    case 'loginBlogger': {
     return [ 
        body('email', 'Email is not empty').notEmpty(),
        body('email', 'Email is not valid').exists().isEmail(),
        body('password','Password must be at least 6 characters long').isLength({ min: 6 })
       ]   
    }
    case 'requestBlogger': {
     return [ 
        body('name', 'name is not empty').notEmpty(),
        body('username', 'username is not empty').notEmpty(),
        body('email', 'Email is not valid').exists().isEmail(),
        body('phone','phone is not empty').notEmpty()
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

