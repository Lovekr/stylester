var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var adminUserSchema = new Schema({  
  username: { type: String, unique: true },
  password: String,
  passwordResetToken: String,
  passwordResetExpires: Date
}, {strict: false,timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }});

var AdminUser = mongoose.model('AdminUser', adminUserSchema);

module.exports = AdminUser;