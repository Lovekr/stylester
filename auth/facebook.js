var mongoose = require('mongoose');
var passport = require('passport'), FacebookStrategy = require('passport-facebook').Strategy;
var FacebookUser  = require('../models/facebookuser.js');
//var FacebookUser  = mongoose.model('FacebookUser');


passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(id, done) {
  FacebookUser.findById(id, function(err, user) {
        done(err, user);
    });       
  
});

passport.use(new FacebookStrategy({
    clientID: "2626905597578343",
    clientSecret: "3204e537fbf0f8670ef60765311faff9",
    callbackURL: "http://localhost:8000/"
  },
  function(accessToken, refreshToken, profile, done) {
    FacebookUser.findOneOrCreate({name: profile.displayName}, {name: profile.displayName,userid: profile.id}, function(err, user) {
      if (err) { return done(err); }
      done(null, user);
    });
  }
));

module.exports = passport;