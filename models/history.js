var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var historySchema = mongoose.Schema({
	modified : {
		type: String,
		required : true
	},
	lastModified : {
		type: Date,
		default : Date.now
	},
	offerId : {
		type: Schema.ObjectId,
		ref : 'offers'
	}
	
},{strict : false});

mongoose.model('history',historySchema);
