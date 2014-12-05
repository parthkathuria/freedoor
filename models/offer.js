var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var offerSchema = mongoose.Schema({
	product_id : {
		type : Schema.ObjectId,
		ref : 'products'
	},
	user_id :{
		type : Schema.ObjectId,
		ref : 'users'
	},
	status : String,
	comment : {
		type : Schema.ObjectId,
		ref : 'comments'
	}
},{strict : false});

mongoose.model('offer',offerSchema);