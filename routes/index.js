var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var moment = require('moment');
var moment_timezone = require('moment-timezone');
var validator = require('validator');
var dateUtils = require('date-utils');

// Getting Schema
var userSchema = require('../models/users.js').userSchema;
var productSchema = require('../models/products.js').productSchema; 
var categorySchema = require('../models/category.js').categorySchema;
var offerSchema = require('../models/offer.js').offerSchema;
var commentSchema = require('../models/comments.js').commentSchema;
var historySchema = require('../models/history.js').historySchema;

var users = mongoose.model('users',userSchema);
var products = mongoose.model('products',productSchema);
var category = mongoose.model('category',categorySchema);
var offers = mongoose.model('offers', offerSchema);
var comments = mongoose.model('comments',commentSchema);
var history = mongoose.model('history',historySchema);


// User APIs

// get all users
router.get('/users', function(req, res) {
	mongoose.model('users').find(function(err, users) {
		if (!err) {
			return res.send(users);
		} else {
			return res.send(500,err);
		}

	});
});

// get user
router.get('/users/:userId',function(req,res){
	mongoose.model('users').findOne({_id: req.params.userId},function(err, users) {
		if (!err) {
			if(users === null){
				return res.status(500).send("User ID not valid.");
			}else{
				return res.send(users);
			}
			
		} else {
			return res.status(500).send(err);
		}

	});
});

// create user
router.post('/users',function(req,res){
	var numRegEx = /^[\s()+-]*([0-9][\s()+-]*){10,13}$/;
	
	var data = new users({
		firstname : req.body.firstname,
		lastname : req.body.lastname,
		emailid : req.body.emailid,
		mobile : req.body.mobile
	});
	
	if(numRegEx.test(data.mobile) === false || validator.isEmail(data.emailid) === false){
		if(numRegEx.test(data.mobile) === false && validator.isEmail(data.emailid) === false){
			return res.status(500).send("Invalid Email ID!\nInvalid Mobile Number!");
		}else if(numRegEx.test(data.mobile) === false){
			return res.status(500).send("Invalid Mobile Number!");
		}else if(validator.isEmail(data.emailid) === false){
			return res.status(500).send("Invalid Email ID!");
		}
	}else{
		data.save(function(err,doc){
			if(!err){
				return res.send(data);
			}else{
				return res.status(500).send(err);
			}
		});
	}
	
});


// Category APIs

// get all categories
router.get('/category', function(req, res) {
	mongoose.model('category').find(function(err, category) {
		if (!err) {
			return res.send(category);
		} else {
			return res.status(500).send(err);
		}

	});
});
// get category
router.get('/category/:categoryId',function(req,res){
	mongoose.model('category').findOne({_id: req.params.categoryId},function(err, category) {
		if (!err) {
			if(category === null){
				return res.status(500).send("Invalid Category ID");
			}else{
				return res.send(category);
			}
		} else {
			return res.status(500).send(err);
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
			return res.status(500).send(err);
		}
	});
});

// Product APIs

// get all products
router.get('/category/:categoryId/products', function(req, res) {
	mongoose.model('category').findOne({_id: req.params.categoryId},function(err, category) {
		if(!err){
			if(category === null){
				return res.status(500).send("Invalid CategoryID");
			}else{
				mongoose.model('products').find({categoryId:req.params.categoryId},function(errProd, products) {
					if (!errProd) {
						return res.send(products);
					} else {
						return res.status(500).send(errProd);
					}
				});
			}
		}else{
			return res.status(500).send(err);
		}
		
	});
});

// get product
router.get('/category/:categoryId/products/:productId',function(req,res){
	var cDate = moment();
	var currentDate = cDate.format('MM-DD-YYYY'); 
	// console.log(currentDate);
	mongoose.model('products').findOne({_id: req.params.productId,categoryId:req.params.categoryId},function(err, product) {
		if (!err) {
			if(product === null){
				return res.status(500).send("Invalid Product Id/Category Id");
			}else{
				var expDate = cDate.format('MM-DD-YYYY');
				// console.log(expDate);
				if((Date.compare(expDate,currentDate) === -1) && (product.isValid === true)){
					product.isValid = false;
					product.update(product,function (errProd) {
					      if (!errProd) {
					    	  mongoose.model('products').findById(req.params.productId,function(updateErr, updateProduct) {
					    		  if(!updateErr){
					    			  res.send(updateProduct);
					    		  }else{
					    			  res.send(updateErr);
					    		  }
					    	  });
					      } else {
					    	  res.status(500).send(errProd);
					      }
					    });
				}else if((Date.compare(expDate,currentDate) === 1) && (product.isValid === false)){
					product.isValid = true;
					product.update(product,function (errProdChk) {
					      if (!errProdChk) {
					    	  mongoose.model('products').findById(req.params.productId,function(updateErrChk, updateProduct) {
					    		  if(!updateErrChk){
					    			  res.send(updateProduct);
					    		  }else{
					    			  res.send(updateErrChk);
					    		  }
					    	  });
					      } else {
					    	  res.status(500).send(errProdChk);
					      }
					    });
				}else{
					return res.send(product);
				}
			}
		} else {
			return res.status(500).send(err);
		}

	});
});

// delete product
router.delete('/category/:categoryId/products/:productId',function(req,res){
	mongoose.model('products').findOne({_id: req.params.productId,categoryId:req.params.categoryId},function(err, product) {
		if (!err) {
			if(product === null){
				return res.status(500).send("Invalid Product Id/Category Id");
			}else{
				mongoose.model('products').remove({_id: req.params.productId,categoryId:req.params.categoryId},function(errProd, products) {
					if (!errProd) {
						return res.send(200);
					} else {
						return res.status(500).send(errProd);
					}

				});
			}
		} else {
			return res.status(500).send(err);
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
	mongoose.model('category').findOne({_id: req.params.categoryId},function(err, category) {
		if(!err){
			if(category === null){
				return res.status(500).send("Invalid CategoryID");
			}else{
				mongoose.model('users').findOne({_id: req.body.userId},function(errUser, users) {
					if (!errUser) {
						if(users === null){
							return res.status(500).send("User ID not valid.");
						}else{
							/*console.log(formatted);
							console.log(req.body.productExpiryDate);
							console.log(Date.compare(formatted,req.body.productExpiryDate));*/
							if(Date.compare(formatted,req.body.productExpiryDate) === 1){
								return res.status(500).send("Product Expiry Date cannot before today's date.");
							}else{
								data.save(function(errSave,doc){
									if(!errSave){
										return res.send(data);
									}else{
										return res.status(500).send(errSave);
									}
								});
							}
							
						}
						
					} else {
						return res.status(500).send(errUser);
					}

				});
				
			}
		}else{
			return res.status(500).send(err);
		}
		
	});
	
});

// update product
router.put('/category/:categoryId/products/:productId',function(req,res){
	var now = moment();
	var formatted = now.format('MM-DD-YYYY');
	mongoose.model('products').findOne({_id: req.params.productId,categoryId:req.params.categoryId},function(err, product) {
		if (!err) {
			if(product === null){
				return res.status(500).send("Invalid Product Id/Category Id");
			}else{
				mongoose.model('products').findById(req.params.productId,function(errProd, product) {
					if(Date.compare(formatted,req.body.productExpiryDate) === 1){
						return res.status(500).send("Product Expiry Date cannot before today's date.");
					}else{
						product.productName = req.body.productName;
						product.quantity = req.body.quantity;
						product.userId = req.body.userId;
						product.expectedOffer = req.body.expectedOffer;
						product.productDesc = req.body.productDesc;
						product.productExpiryDate = req.body.productExpiryDate;
						product.isValid = req.body.isValid;
						product.categoryId = req.params.categoryId;
						product.lastUpdated = formatted;
						product.update(product,function (errProdChk) {
					      if (!errProdChk) {
					    	  mongoose.model('products').findById(req.params.productId,function(updateErr, updateProduct) {
					    		  if(!updateErr){
					    			  res.send(updateProduct);
					    		  }else{
					    			  res.send(updateErr);
					    		  }
					    	  });
					      } else {
					    	  res.status(500).send(errProdChk);
					      }
					    });
					}
				});
			}
		}else{
			return res.status(500).send(err);
		}
	});
	
});

// Offer APIs

// get all offers
router.get('/category/:categoryId/products/:productId/offers', function(req, res) {
	mongoose.model('products').findOne({_id: req.params.productId,categoryId:req.params.categoryId},function(errChk, product) {
		if(!errChk){
			if(product === null){
				return res.status(500).send("Invalid ProductID/CategoryID");
			}else{
				mongoose.model('offers').find({productId:req.params.productId},function(err, offers) {
					if (!err) {
						return res.send(offers);
					} else {
						return res.status(500).send(err);
					}
				});
			}
		}else{
			return res.status(500).send(errChk);
		}
	});
	
});

// get offer
router.get('/category/:categoryId/products/:productId/offers/:offerId',function(req,res){
	var cDate = moment();
	var currentDate = cDate.format("MM-DD-YYYY");
	mongoose.model('category').findOne({_id: req.params.categoryId},function(errChk, category) {
		if(!errChk){
			if(category === null){
				return res.status(500).send("Invalid CategoryID");
			}else{
				mongoose.model('offers').findOne({_id: req.params.offerId,productId:req.params.productId},function(err, offer) {
					if (!err) {
						if(offer === null){
							return res.status(500).send("Invalid ProductID/OfferID");
						}else{
							if((Date.compare(offer.offerExpiry,currentDate) === 1) && (offer.buyerStatus === "pending")){
								offer.buyerStatus = "offer expired";
								offer.update(offer,function(offerErr){
									if(!offerErr){
										mongoose.model('offers').findById(req.params.offerId,function(updateErr, updateOffer) {
								    		  if(!updateErr){
								    			  res.send(updateOffer);
								    		  }else{
								    			  res.send(updateErr);
								    		  }
										});
									}else{
										return res.status(500).send(offerErr);
									}
								});
							}else{
								return res.send(offer);
							}
						}
						
					} else {
						return res.status(500).send(err);
					}

				});
			}
		}else{
			return res.status(500).send(errChk);
		}
	});
	
});

// delete offer
router.delete('/category/:categoryId/products/:productId/offers/:offerId',function(req,res){
	mongoose.model('products').findOne({_id: req.params.categoryId,categoryId: req.params.categoryId},function(errChk, product) {
		if(!errChk){
			if(product === null){
				return res.status(500).send("Invalid ProductID/CategoryID");
			}else{
				mongoose.model('offers').findOne({_id: req.params.offerId,productId:req.params.productId},function(err, offer) {
					if (!err) {
						if(offer === null){
							return res.status(500).send("Invalid ProductID/OfferID");
						}else{
							mongoose.model('offers').remove({_id: req.params.offerId,productId:req.params.productId},function(errOff, offers) {
								if (!errOff) {
									return res.send(200);
								} else {
									return res.status(500).send(errOff);
								}

							});
						}
					}else{
						return res.status(500).send(err);
					}
				});
			}
		}else{
			return res.status(500).send(errChk);
		}
	});
	
});

// update offer
router.put('/category/:categoryId/products/:productId/offers/:offerId',function(req,res){
	var now = moment();
	var formatted = now.format('MM-DD-YYYY');
	mongoose.model('products').findOne({_id: req.params.productId,categoryId: req.params.categoryId},function(errChk, product) {
		if(!errChk){
			if(product === null){
				return res.status(500).send("Invalid ProductID/CategoryID");
			}else{
				mongoose.model('offers').findOne({_id:req.params.offerId},function(err, offer) {
					if(offer === null){
						return res.status(500).send("Invalid Offer Id");
					}else{
						var offerQty = offer.buyingQty;
						  if(offer.sellerStatus === "accepted"){
				    		  offer.buyerStatus = "accepted";
				    		  mongoose.model('products').findOne({_id:req.params.productId},function(prodErr,product){
				    			  if(!prodErr){
						    			if(product === null){
						    				 return res.status(500).send("Invalid Product ID");
						    			}else{
						    				product.quantity = product.quantity - offerQty;
						    				product.update(product,function(pErr){
						    					if(pErr){
						    						return res.status(500).send(pErr);
						    					}
						    				});
						    			} 
				    			  }
				    		  });
				    	  }
						  offer.buyingQty = req.body.buyingQty;
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
						    	  mongoose.model('history').findOne({offerId:req.params.offerId},function(historyErr,history){
						    		 if(!historyErr){
						    			 if(history === null){
						    				 var historyData = new history({
									    		  	modified : "Offer modified",
									    	  		lastModified : formatted
									    	  });
						    				 historyDate.save(function(hErr){
						    					if(hErr){
						    						return res.status(500).send(hErr);
						    					}
						    				 });
						    			 }else{
						    				 history.modified = "Offer Modified";
						    				 history.lastModified = formatted;
						    				 hisotry.update(history,function(hErrChk){
						    					if(hErrChk){
						    						return res.status(500).send(hErrChk);
						    					} 
						    				 });
						    			 }
						    		 } else {
						    			 return res.status(500).send(historyErr);
						    		 }
						    	  });
						    	  var historyData = new history({
						    		  	modified : "Offer modified",
						    	  		lastModified : formatted
						    	  });
						    	  historyData.save
						      } else {
						    	  res.status(500).send(err);
						      }
						    });
					}

				});
			}
		}else{
			return res.status(500).send(errChk);
		}
	});
	
});

// create offer
router.post('/category/:categoryId/products/:productId/offers',function(req,res){
	var now = moment();
	var formatted = now.format('MM-DD-YYYY');
	var data = new offers({
		buyingQty : req.body.buyingQty,
		offeredDetails : req.body.offeredDetails,
		offerExpiry : req.body.offerExpiry,
		productId : req.params.productId,
		buyerId : req.body.buyerId,
		lastModified : formatted,
		comments : req.body.comments
		
	});
	
	mongoose.model('products').findOne({_id: req.params.productId,categoryId: req.params.categoryId},function(errChk, product) {
		if(!errChk){
			if(product === null){
				return res.status(500).send("Invalid ProductID/CategoryID");
			}else{
				if(Date.compare(req.body.offerExpiry,formatted) === -1){
					return res.status(500).send("Offer Expiry Date is invalid");
				}else{
					if(product.quantity < req.body.buyingQty){
						return res.status(500).send("Buying Quantity cannot be greater than Total Product Quantity");
					}else{
						mongoose.model('users').findOne({_id:req.body.buyerId},function(errBuyer,buyer){
							if(!errBuyer){
								if(buyer === null){
									return res.status(500).send("Invalid Buyer ID");
								}else{
									data.save(function(err,doc){
										if(!err){
											return res.send(data);
										}else{
											return res.status(500).send(err);
										}
									});
								}
							}else{
								return res.status(500).send(errBuyer);
							}
						});
						
					}
				}
			}
		}else{
			return res.status(500).send(errChk);
		}
	});
});

//get offer history
router.get('/category/:categoryId/products/:productId/offers/:offerId/history', function(req, res){
	mongoose.model('history').findOne({offerId:req.params.offerId},function(historyErr,history){
		if(!historyErr){
			if(history === null){
				return res.status(500).send("Invalid Offer ID");
			}else{
				return res.send(history);
			}
		}else{
			return res.status(500).send(historyErr);
		}
	});
});

// Comment APIs

// get all comments
router.get('/category/:categoryId/products/:productId/offers/:offerId/comments', function(req, res) {
	mongoose.model('products').findOne({_id:req.params.productId,categoryId:req.params.categoryId},function(prodErr,product){
		if(!prodErr){
			if(product === null){
				return res.status(500).send("Invalid ProductId/CategoryId");
			}else{
				mongoose.model('offers').findOne({_id:req.param.offerId},function(offerErr,offer){
					if(!offerErr){
						if(offer === null){
							return res.status(500).send("Invalid OfferID");
						}else{
							mongoose.model('comments').find({offerId: req.params.offerId},function(err, comments) {
								if (!err) {
									return res.send(comments);
								} else {
									return res.status(500).send(err);
								}

							});
						}
					}else{
						return res.status(500).send(offerErr);
					}
				});
			}
		}else{
			return res.status(500).send(prodErr);
		}
	});
	
});

// get comment
router.get('/category/:categoryId/products/:productId/offers/:offerId/comments/:commentId',function(req,res){
	mongoose.model('products').findOne({_id:req.params.productId,categoryId:req.params.categoryId},function(prodErr,product){
		if(!prodErr){
			if(product === null){
				return res.status(500).send("Invalid ProductId/CategoryId");
			}else{
				mongoose.model('offers').findOne({_id:req.param.offerId},function(offerErr,offer){
					if(!offerErr){
						if(offer === null){
							return res.status(500).send("Invalid OfferID");
						}else{
							mongoose.model('comments').findOne({_id: req.params.commentId,offerId: req.params.offerId},function(err, comments) {
								if (!err) {
									if(comments === null){
										return res.status(500).send("Invalid CommentID/OfferId");
									}else{
										return res.send(comments);
									}
								} else {
									return res.status(500).send(err);
								}

							});
						}
					}else{
						return res.status(500).send(offerErr);
					}
				});
			}
		}else{
			return res.status(500).send(prodErr);
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
	
	mongoose.model('products').findOne({_id:req.params.productId,categoryId:req.params.categoryId},function(prodErr,product){
		if(!prodErr){
			if(product === null){
				return res.status(500).send("Invalid ProductId/CategoryId");
			}else{
				mongoose.model('offers').findOne({_id:req.param.offerId},function(offerErr,offer){
					if(!offerErr){
						if(offer === null){
							return res.status(500).send("Invalid OfferID");
						}else{
							data.save(function(err,doc){
								if(!err){
									return res.send(data);
								}else{
									return res.status(500).send(err);
								}
							});
						}
					}else{
						return res.status(500).send(offerErr);
					}
				});
			}
		}else{
			return res.status(500).send(prodErr);
		}
	});
	
	
});

module.exports = router;
