var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var categorySchema = mongoose.Schema({
	
	categoryName : {
		type: String,
		required : true
	}

},{strict : true});

mongoose.model('category',categorySchema);
