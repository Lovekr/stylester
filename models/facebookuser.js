var mongoose = require('mongoose');

var facebookUserSchema = new mongoose.Schema({
  _id:{typr:String},
  name: {type:String},
  userid: {type:String},
  email: {type:String},
  updated_at: { type: Date, default: Date.now },
});

facebookUserSchema.statics.findOrCreate = require("find-or-create");

module.exports = mongoose.model('FacebookUser', facebookUserSchema);