var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var hotdealSchema = new Schema({
    title:{type:String},
    sub_title:{type:String},
    description:{type:String},
    image_title:{type:String},
    discount_percentage:{type:String},
    producturl:{type:Array}
},{strict: false,timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }});

var Hotdeal = mongoose.model('Hotdeal', hotdealSchema);

module.exports = Hotdeal;