var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var offerSchema = mongoose.Schema({
	productId : {
		type : Schema.ObjectId,
		ref : 'products'
	},
	buyerId :{
		type : Schema.ObjectId,
		ref : 'users'
	},
	buyingQty : Number,
	offeredDetails : String,
	buyerStatus : {
		type : String,
		default : "pending"
	},
	sellerStatus : {
		type : String,
		default : "pending"
	},
	offerExpiry : Date,
	comments : {
		type : Schema.ObjectId,
		ref : 'comments'
	}
},{strict : false});

mongoose.model('offers',offerSchema);