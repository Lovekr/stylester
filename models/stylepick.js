var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var stylepickSchema = new Schema({
    title:{type:String},
    sub_title:{type:String},
    description:{type:String},
    image_title:{type:String},
    price:{type:String},
    producturl:{type:Array}
},{strict: false,timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }});

var Stylepick = mongoose.model('Stylepick', stylepickSchema);

module.exports = Stylepick;