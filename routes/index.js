var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var moment = require('moment');
var moment_timezone = require('moment-timezone');
var validator = require('validator');

// Getting Schema
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


// User APIs

//get all users
router.get('/users', function(req, res) {
	mongoose.model('users').find(function(err, users) {
		if (!err) {
			return res.send(users);
		} else {
			return res.send(500,err);
		}

	});
});

//get user
router.get('/users/:userId',function(req,res){
	mongoose.model('users').findOne({_id: req.params.userId},function(err, users) {
		if (!err) {
			if(users === null){
				return res.send("User ID not valid.");
			}else{
				return res.send(users);
			}
			
		} else {
			return res.send(500,err);
		}

	});
});

//create user
router.post('/users',function(req,res){
	//var emailRegEx = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
	var numRegEx = /^[\s()+-]*([0-9][\s()+-]*){10,13}$/;
	
	var data = new users({
		firstname : req.body.firstname,
		lastname : req.body.lastname,
		emailid : req.body.emailid,
		mobile : req.body.mobile
	});
	
	/*if(emailRegEx.test(data.emailid) === false || numRegEx.test(data.mobile) === false){
		if(emailRegEx.test(data.emailid) === false){
			return res.send("Please enter valid Email Id");
		}else if(numRegEx.test(data.mobile) === false){
			return res.send("Please enter valid phone number");
		}
	}*/
	
	/*if(numRegEx.test(data.mobile) == false){
		
	}*/
	if(validator.isEmail(data.emailid)){
		data.save(function(err,doc){
			if(!err){
				return res.send(data);
			}else{
				return res.send(err);
			}
		});
	}
	else{
		return res.send(500, "Email not valid!");
	}
});


// Category APIs

// get all categories
router.get('/category', function(req, res) {
	mongoose.model('category').find(function(err, category) {
		if (!err) {
			return res.send(category);
		} else {
			return res.send(500,err);
		}

	});
});
// get category
router.get('/category/:categoryId',function(req,res){
	mongoose.model('category').find({_id: req.params.categoryId},function(err, category) {
		if (!err) {
			return res.send(category);
		} else {
			return res.send(500,err);
		}

	});
});
// post category
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
	});
});

// Product APIs

// get all products
router.get('/category/:categoryId/products', function(req, res) {
	mongoose.model('products').find({categoryId:req.params.categoryId},function(err, products) {
		if (!err) {
			return res.send(products);
		} else {
			return res.send(500,err);
		}

	});
});

// get product
router.get('/category/:categoryId/products/:productId',function(req,res){
	mongoose.model('products').find({_id: req.params.productId,categoryId:req.params.categoryId},function(err, products) {
		
		if (!err) {
			return res.send(products);
		} else {
			return res.send(500,err);
		}

	});
});

// delete product
router.delete('/category/:categoryId/products/:productId',function(req,res){
	mongoose.model('products').remove({_id: req.params.productId,categoryId:req.params.categoryId},function(err, products) {
		if (!err) {
			return res.send(200);
		} else {
			return res.send(500,err);
		}

	});
});

// create product
router.post('/category/:categoryId/products',function(req,res){
	var now = moment();
	var formatted = now.format('MM-DD-YYYY');
	var data = new products({
		productName : req.body.productName,
		quantity : req.body.quantity,
		userId : req.body.userId,
		expectedOffer : req.body.expectedOffer,
		productDesc : req.body.productDesc,
		productExpiryDate : req.body.productExpiryDate,
		isValid : req.body.isValid,
		categoryId : req.params.categoryId,
		lastUpdated : formatted
		
	});
	
	data.save(function(err,doc){
		if(!err){
			return res.send(data);
		}else{
			return res.send(500,err);
		}
	});
});

// update product
router.put('/category/:categoryId/products/:productId',function(req,res){
	var now = moment();
	var formatted = now.format('MM-DD-YYYY');
	//console.log(formatted);
	//console.log(moment_timezone().tz("America/Los_Angeles").format());
	mongoose.model('products').findById(req.params.productId,function(err, product) {
		product.productName = req.body.productName;
		product.quantity = req.body.quantity;
		product.userId = req.body.userId;
		product.expectedOffer = req.body.expectedOffer;
		product.productDesc = req.body.productDesc;
		product.productExpiryDate = req.body.productExpiryDate;
		product.isValid = req.body.isValid;
		product.categoryId = req.params.categoryId;
		product.lastUpdated = formatted;
		product.update(product,function (err) {
		      if (!err) {
		    	  mongoose.model('products').findById(req.params.productId,function(updateErr, updateProduct) {
		    		  if(!updateErr){
		    			  res.send(updateProduct);
		    		  }else{
		    			  res.send(updateErr);
		    		  }
		    	  });
		      } else {
		    	  res.send(500,err);
		      }
		    });

	});
});

// Offer APIs

// get all offers
router.get('/category/:categoryId/products/:productId/offers', function(req, res) {
	mongoose.model('offers').find({productId:req.params.productId},function(err, offers) {
		if (!err) {
			return res.send(offers);
		} else {
			return res.send(500,err);
		}

	});
});

// get offer
router.get('/category/:categoryId/products/:productId/offers/:offerId',function(req,res){
	mongoose.model('offers').find({_id: req.params.offerId,productId:req.params.productId},function(err, offers) {
		if (!err) {
			return res.send(offers);
		} else {
			return res.send(500,err);
		}

	});
});

// delete offer
router.delete('/category/:categoryId/products/:productId/offers/:offerId',function(req,res){
	mongoose.model('offers').remove({_id: req.params.offerId,productId:req.params.productId},function(err, offers) {
		if (!err) {
			return res.send(200);
		} else {
			return res.send(500,err);
		}

	});
});

// update offer
router.put('/category/:categoryId/products/:productId/offers/:offerId',function(req,res){
	var now = moment();
	var formatted = now.format('MM-DD-YYYY');
	mongoose.model('offers').findById(req.params.offerId,function(err, offer) {
		offer.buyingQty = req.boy.buyingQty;
		offer.offeredDetails = req.body.offeredDetails;
		offer.buyerStatus = req.body.buyerStatus;
		offer.sellerStatus = req.body.sellerStatus;
		offer.offerExpiry = req.body.offerExpiry;
		offer.productId = req.params.productId;
		offer.buyerId = req.body.buyerId;
		offer.lastModified = formatted;
		offer.comments = req.body.comments;
		offer.update(offer,function (err) {
		      if (!err) {
		    	  mongoose.model('offers').findById(req.params.offerId,function(updateErr, updateOffer) {
		    		  if(!updateErr){
		    			  res.send(updateOffer);
		    		  }else{
		    			  res.send(updateErr);
		    		  }
		    	  });
		      } else {
		    	  res.send(500,err);
		      }
		    });


	});
});

//create offer
router.post('/category/:categoryId/products/:productId/offers',function(req,res){
	var now = moment();
	var formatted = now.format('MM-DD-YYYY');
	var data = new offers({
		buyingQty : req.body.buyingQty,
		offeredDetails : req.body.offeredDetails,
		buyerStatus : req.body.buyerStatus,
		sellerStatus : req.body.sellerStatus,
		offerExpiry : req.body.offerExpiry,
		productId : req.params.productId,
		buyerId : req.body.buyerId,
		lastModified : formatted,
		comments : req.body.comments
		
	});
	
	data.save(function(err,doc){
		if(!err){
			return res.send(data);
		}else{
			return res.send(500,err);
		}
	})
});

// Comment APIs

// get all comments
router.get('/category/:categoryId/products/:productId/offers/:offerId/comments', function(req, res) {
	mongoose.model('comments').find({offerId: req.params.offerId},function(err, comments) {
		if (!err) {
			return res.send(comments);
		} else {
			return res.send(500,err);
		}

	});
});
// get comment
router.get('/category/:categoryId/products/:productId/offers/:offerId/comments/:commentId',function(req,res){
	mongoose.model('comments').find({_id: req.params.commentId,offerId: req.params.offerId},function(err, comments) {
		if (!err) {
			return res.send(comments);
		} else {
			return res.send(500,err);
		}

	});
});
// post comment
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
			return res.send(500,err);
		}
	})
});

module.exports = router;
