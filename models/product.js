var mongoose = require('mongoose');

var mongoosePaginate = require('mongoose-paginate');


var Schema = mongoose.Schema;

var productSchema = new Schema({

	SR_NO: { type: String},

	STYLSTER_ID:    { type: String},

	PRODUCT_NAME: { type: String },

	CATEGORY: { type: String },

	SUB_CATEGORY: { type: String },

	SUPER_SUB_CATEGORY: { type: String },

	IMAGE_LINK: { type: String },

	SIZE: { type: String },

	COLOUR: { type: String },

	BRAND: { type: String },

	WEBSITE_NAME: { type: String },

	PATTERN: { type: String },

	MATERIAL: { type: String },

	OCCASION: { type: String },

	PRICE: { type: String },

	OLD_PRICE: { type: String },

	DISCOUNT_PERCENTAGE: { type: String },

	WEBSITE_LINK: { type: String },

	DESCRIPTION: { type: String },

	STORE_PRODUCT_ID: { type: String },

	GENDER: { type: String },

	FIT: { type: String },

	LENGTH: { type: String },

	NECK: { type: String },

	SLEEVE_LENGTH: { type: String },

	COLLAR: { type: String },

	TECHNOLOGY: { type: String },

	TYPE: { type: String },

	SPORT: { type: String },

	MULTI_PACK_SET: { type: String },

	FEATURES: { type: String },

	SLEEVE_STYLE: { type: String },

	TRANSPARENCY: { type: String },

	DISTRESS: { type: String },
	
	FADE: { type: String },

	SHADE: { type: String },

	WAIST_RISE: { type: String },

	PADDING: { type: String },

	SEAM: { type: String },

	STRAPS: { type: String },

	WIRING: { type: String },

	HEEL_HEIGHT: { type: String },

	HEEL_TYPE: { type: String },

	EFFECT: { type: String },

	APPLICATION: { type: String },

	INGREDIENT: { type: String },

	SPECIALITY: { type: String },

	FINISH: { type: String },

	PREFERENCE: { type: String },

	FORMULATION: { type: String },

	COVERAGE: { type: String },

	SKIN_TYPE: { type: String },

	CONCERN: { type:String }

	});

    productSchema.plugin(mongoosePaginate);

var Product = mongoose.model('Product', productSchema);

module.exports = Product;