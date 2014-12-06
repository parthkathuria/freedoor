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


//User APIs
router.get('/users', function(req, res) {
	mongoose.model('users').find(function(err, users) {
		if (!err) {
			return res.send(users);
		} else {
			return res.send(err);
		}

	});
});

router.get('/users/:userId',function(req,res){
	mongoose.model('users').find({_id: req.params.userId},function(err, users) {
		if (!err) {
			return res.send(users);
		} else {
			return res.send(err);
		}

	});
});

router.post('/users',function(req,res){
	var data = new users({
		firstname : req.body.firstname,
		lastname : req.body.lastname,
		emailid : req.body.emailid,
		mobile : req.body.mobile
	});
	
	data.save(function(err,doc){
		if(!err){
			return res.send(data);
		}else{
			return res.send(err);
		}
	})
});


//Category APIs

router.get('/category', function(req, res) {
	mongoose.model('category').find(function(err, category) {
		if (!err) {
			return res.send(category);
		} else {
			return res.send(err);
		}

	});
});

router.get('/category/:categoryId',function(req,res){
	mongoose.model('category').find({_id: req.params.categoryId},function(err, category) {
		if (!err) {
			return res.send(category);
		} else {
			return res.send(err);
		}

	});
});

router.post('/category',function(req,res){
	var data = new category({
		categoryName : req.body.categoryName,
	});
	
	data.save(function(err,doc){
		if(!err){
			return res.send(data);
		}else{
			return res.send(err);
		}
	})
});

//Product APIs

//get all products
router.get('/category/:categoryId/products', function(req, res) {
	mongoose.model('products').find({categoryId:req.params.categoryId},function(err, products) {
		if (!err) {
			return res.send(products);
		} else {
			return res.send(err);
		}

	});
});

//get product
router.get('/category/:categoryId/products/:productId',function(req,res){
	mongoose.model('products').find({_id: req.params.productId,categoryId:req.params.categoryId},function(err, products) {
		if (!err) {
			return res.send(products);
		} else {
			return res.send(err);
		}

	});
});

//create product
router.post('/category/:categoryId/products',function(req,res){
	var data = new products({
		productName : req.body.productName,
		quantity : req.body.quantity,
		userId : req.body.userId,
		expectedOffer : req.body.expectedOffer,
		productDesc : req.body.productDesc,
		productExpiryDate : req.body.productExpiryDate,
		isValid : req.body.isValid,
		categoryId : req.body.categoryId,
		lastUpdated : req.body.lastUpdated
		
	});
	
	data.save(function(err,doc){
		if(!err){
			return res.send(data);
		}else{
			return res.send(err);
		}
	})
});


module.exports = router;
