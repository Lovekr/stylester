var express = require('express');
var router = express.Router();
var passportFacebook = require('../auth/facebook.js');
var passportGoogle = require('../auth/google.js');

router.get('/facebook', passportFacebook.authenticate('facebook'));

router.get('/facebook/callback', passportFacebook.authenticate('facebook'),
  function(req, res) {
    // Successful authentication, redirect home.
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