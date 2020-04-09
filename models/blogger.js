var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var bloggerSchema = new Schema({
  name: String,
  email: { type: String, unique: true },
  gender: { type:String},
  isVerified: { type: Boolean, default: false },
  password: String,
  passwordResetToken: String,
  passwordResetExpires: Date
}, {strict: false,timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }});

var Blogger = mongoose.model('Blogger', bloggerSchema);

var requestBloggerSchema = new Schema({
  name: String,
  username:String,
  email: { type: String, unique: true },
  phone: { type:String},
  facebookprofile:{ type:String},
  facebooklikes:{ type:String},
  twitterprofile:{ type:String},
  twitterlikes:{ type:String},
  instagramprofile:{ type:String},
  instagramlikes:{ type:String},
  pinterestprofile:{ type:String},
  pinterestlikes:{ type:String},
  location: {type:String},
  status: {type:String}
}, {strict: false,timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }});

var RequestBlogger = mongoose.model('RequestBlogger', requestBloggerSchema);


module.exports = {'Blogger':Blogger,'RequestBlogger':RequestBlogger};