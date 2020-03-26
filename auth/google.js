var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var FacebookUser  = require('../models/facebookuser');

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

passport.use(new GoogleStrategy({
    clientID: "864732900594-iehv2c74t2sma9907eaa5nqvkb5letph.apps.googleusercontent.com",
    clientSecret: "NKtSObTMiYVqZE7JDZRSDrQ8",
    callbackURL: "http://localhost:8000/"
  },
  function(accessToken, refreshToken, profile, done) {
       FacebookUser.findOrCreate({ userid: profile.id }, { name: profile.displayName,userid: profile.id }, function (err, user) {
           console.log(user);
         //return done(err, user);
       });
  }
));

module.exports = passport;