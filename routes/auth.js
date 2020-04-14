var express = require('express');
var router = express.Router();
var passportFacebook = require('../auth/facebook.js');
var passportGoogle = require('../auth/google.js');




/* LOGOUT ROUTER */
router.get('/logout', function(req, res){
  req.logout();
  res.redirect('/login');
});
router.get('/facebook', passportFacebook.authenticate('facebook',{ scope : ['email'] }),function(req, res){
  
});

router.get('/facebook/callback', passportFacebook.authenticate('facebook',{ failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/index.html');
    res.status(200);
  });

  /* GOOGLE ROUTER */
  router.get('/google',
    passportGoogle.authenticate('google',{scope: 'https://www.googleapis.com/auth/plus.login'}));

  router.get('/google/callback',
    passportGoogle.authenticate('google'),
    function(req, res) {
      res.status(200);
    });


  module.exports = router;