var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
	firstname : {
		type:String,
		required : true
	},
	lastname : {
		type:String,
		required : true
	},
	emailid : {
		type: String,
		unique : true,
		required : true
	},
	mobile : Number
	
},{strict : false});

mongoose.model('users',userSchema);
