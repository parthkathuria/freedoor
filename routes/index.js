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
var offers = mongoose.model('offers', offerSchema);
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

//get all categories
router.get('/category', function(req, res) {
	mongoose.model('category').find(function(err, category) {
		if (!err) {
			return res.send(category);
		} else {
			return res.send(err);
		}

	});
});
//get category
router.get('/category/:categoryId',function(req,res){
	mongoose.model('category').find({_id: req.params.categoryId},function(err, category) {
		if (!err) {
			return res.send(category);
		} else {
			return res.send(err);
		}

	});
});
//post category
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
		categoryId : req.params.categoryId,
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

//Offer APIs

//get all offers
router.get('/category/:categoryId/products/:productId/offers', function(req, res) {
	mongoose.model('offers').find({productId:req.params.productId},function(err, offers) {
		if (!err) {
			return res.send(offers);
		} else {
			return res.send(err);
		}

	});
});

//get offer
router.get('/category/:categoryId/products/:productId/offers/:offerId',function(req,res){
	mongoose.model('offers').find({_id: req.params.offerId,productId:req.params.productId},function(err, offers) {
		if (!err) {
			return res.send(offers);
		} else {
			return res.send(err);
		}

	});
});

//create offer
router.post('/category/:categoryId/products/:productId/offers',function(req,res){
	var data = new offers({
		buyingQty : req.body.buyingQty,
		offeredDetails : req.body.offeredDetails,
		buyerStatus : req.body.buyerStatus,
		sellerStatus : req.body.sellerStatus,
		offerExpiry : req.body.offerExpiry,
		productId : req.params.productId,
		buyerId : req.body.buyerId,
		lastModified : req.body.lastModified,
		comments : req.body.comments
		
	});
	
	data.save(function(err,doc){
		if(!err){
			return res.send(data);
		}else{
			return res.send(err);
		}
	})
});


//Comment APIs

//get all comments
router.get('/category/:categoryId/products/:productId/offers/:offerId/comments', function(req, res) {
	mongoose.model('comments').find({offerId: req.params.offerId},function(err, comments) {
		if (!err) {
			return res.send(comments);
		} else {
			return res.send(err);
		}

	});
});
//get comment
router.get('/category/:categoryId/products/:productId/offers/:offerId/comments/:commentId',function(req,res){
	mongoose.model('comments').find({_id: req.params.commentId,offerId: req.params.offerId},function(err, comments) {
		if (!err) {
			return res.send(comments);
		} else {
			return res.send(err);
		}

	});
});
//post comment
router.post('/category/:categoryId/products/:productId/offers/:offerId/comments',function(req,res){
	var data = new comments({
		comment : req.body.comment,
		 userId : req.body.userId,
		 offerId : req.params.offerId
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
