var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var productSchema = mongoose.Schema({
	categoryId : {
		type : Schema.ObjectId,
		ref : 'catergory'
	},
	userId : {
		type: Schema.ObjectId,
		ref : 'users',
		required : true
	},
	productName : {
		type: String,
		required : true
	},
	productDesc : {
		type:String,
		required : true
	},
	expectedOffer : {
		type: String
	},
	quantity : {
		type: Number,
		required : true
	},
	isValid : Boolean,
	productExpiryDate : Date,
	lastUpdated : {
		type : Date,
	}
	
},{strict : false});

mongoose.model('products',productSchema);