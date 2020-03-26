var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var userSchema = new Schema({
  name: String,
  email: { type: String, unique: true },
  gender: { type:String},
  isVerified: { type: Boolean, default: false },
  password: String,
  passwordResetToken: String,
  passwordResetExpires: Date
}, {strict: false,timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }});

var User = mongoose.model('User', userSchema);

module.exports = User;