var mongoose = require('mongoose');

var facebookUserSchema = new mongoose.Schema({
  name: String,
  userid: String,
  updated_at: { type: Date, default: Date.now },
});

facebookUserSchema.statics.findOneOrCreate = require("find-or-create");

module.exports = mongoose.model('FacebookUser', facebookUserSchema);