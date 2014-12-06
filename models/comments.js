var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var commentSchema = mongoose.Schema({
	comment : {
		type: String,
		required : true
	},
	userId : {
		type: Schema.ObjectId,
		ref : 'users'
	},
	offerId : {
		type: Schema.ObjectId,
		ref : 'offers'
	}
	
},{strict : false});

mongoose.model('comments',commentSchema);
