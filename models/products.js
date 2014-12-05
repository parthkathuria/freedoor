var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var productSchema = mongoose.Schema({
	category_id : {
		type : Schema.ObjectId,
		ref : 'catergory'
	},
	user_id : {
		type: Schema.ObjectId,
		ref : 'users'
	},
	product_name : {
		type: String,
		required : true
	},
	productDesc : {
		type:String,
		required : true
	},
	expectedOffer : {
		type: String,
		required : true
	},
	quantity : {
		type: Number,
		required : true
	},
	status : String,
	isValid : Boolean,
	productExpiryDate : Date
	
},{strict : false});

mongoose.model('products',productSchema);