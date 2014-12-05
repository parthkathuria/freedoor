var mongoose = require('mongoose');

var commentSchema = mongoose.Schema({
	comment : {
		type: String,
		required : true
	}
	
},{strict : false});

mongoose.model('comments',commentSchema);
