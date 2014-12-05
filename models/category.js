var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var categorySchema = mongoose.Schema({
	
	category_name : {
		type: String,
		required : true
	}

},{strict : false});

mongoose.model('category',categorySchema);
