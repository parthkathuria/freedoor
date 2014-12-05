var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

//Getting Schema
var userSchema = require('../models/users.js').userSchema;
var productSchema = require('../models/products.js').productSchema; 
var categorySchema = require('../models/category.js').categorySchema;
var offerSchema = require('../models/offer.js').offerSchema;
var commentSchema = require('../models/comments.js').commentSchema;


var users = mongoose.model('users',userSchema);
var products = mongoose.model('products',productSchema);
var category = mongoose.model('category',categorySchema);
var offer = mongoose.model('offer', offerSchema);
var comments = mongoose.model('comments',commentSchema);


var userId = 0;

router.get('/users', function(req, res) {
	mongoose.model('users').find(function(err, users) {
		if (!err) {
			return res.send(users);
		} else {
			return res.send(err);
		}

	});
});

router.post('/users',function(req,res){
	var data = new users({
		name : req.body.name,
		email : req.body.email,
		phone : req.body.phone
	});
	
	data.save(function(err,doc){
		if(!err){
			return res.send(data);
		}else{
			return res.send(err);
		}
	})
});

function generateUserId(){
	return userId++;
}
module.exports = router;
