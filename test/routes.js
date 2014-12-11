var should = require('should'); 
var assert = require('assert');
var request = require('supertest'); 
var express = require('express'); 
var mongoose = require('mongoose');
var app = express();
//var config = require('./config-debug');
 
describe('Routing', function() {
  var url = 'http://localhost:3000';
  before(function(done) {
    //mongoose.connect('mongodb://192.168.1.10:27017/freedoor');							
    done();
  });
  describe('users', function() {
    var valid_seller_email      ="seller003@gmail.com";
    var invalid_seller_email    ="seller";
    var valid_buyer_email       ="buyer003@gmail.com";
    var invalid_buyerr_email    ="seller";
    var productExpiryDate       = "12-25-2014";
    var expiredProductID        = "";
    var expiredCategoryID       = "";
    var UserID                  = "";
    var categoryID              = "";
    var productID               = "";
    var commentID               = "";
    var offerID                 = "";
    var buyerID                 = "";

    //To test insert
    it('1.test POST insert: should return status 200 ', function(done) {
      var profile = {
        "firstname": "tomy",
        "lastname": "Gheri",
        "emailid":valid_seller_email,
 		    "mobile":"4086099054"
      };
    request(url)
	.post('/users')
	.send(profile)
    // end handles the response
	.end(function(err, res) {
          if (err) {
            throw err;
          }
          
          UserID = res.body._id;
          //console.log(UserID);
          (res.status).should.equal(200);
          done();
        });
    });

    //To test insert
    it('2.test POST insert buyer: should return status 200 ', function(done) {
      var profile = {
        "firstname": "tomy",
        "lastname": "Gheri",
        "emailid":valid_buyer_email,
        "mobile":"9954086095"
      };
    request(url)
  .post('/users')
  .send(profile)
    // end handles the response
  .end(function(err, res) {
          if (err) {
            throw err;
          }
          
          buyerID = res.body._id;
          //console.log(UserID);
          (res.status).should.equal(200);
          done();
        });
    });

    //test duplicate entry
    it('3.test POST duplicate entry: should return status 500 ', function(done) {
      var profile = {
        "firstname": "tomy",
        "lastname": "Gheri",
        "emailid":valid_seller_email,
        "mobile":"4086099054"
      };
    request(url)
	.post('/users')
	.send(profile)
	.end(function(err, res) {
          if (err) {
            throw err;
          }
          (res.status).should.equal(500);
          done();
        });
    });

    //test email
    it('4.test POST invalid email : should return status 500 ', function(done) {
      var profile = {
        "firstname": "tomy",
        "lastname": "Gheri",
        "emailid":invalid_seller_email,
        "mobile":"4086099054"
      };
    request(url)
  .post('/users')
  .send(profile)
  .end(function(err, res) {
          if (err) {
            throw err;
          }
          (res.status).should.equal(500);
          done();
        });
    });


    //test mobile number - 1
    it('5.Test POST invalid mobile number1: should return status 500 ', function(done) {
      var profile = {
        "firstname": "tomy",
        "lastname": "Gheri",
        "emailid":"test2@gmail.com",
        "mobile":"hhhh"
      };
    request(url)
  .post('/users')
  .send(profile)
  .end(function(err, res) {
          if (err) {
            throw err;
          }
          (res.status).should.equal(500);
          done();
        });
    });

    //test mobile number - 2
    it('6.Test POST invalid mobile number2: should return status 500 ', function(done) {
      var profile = {
        "firstname": "tomy",
        "lastname": "Gheri",
        "emailid":"test2@gmail.com",
        "mobile":"87878778"
      };
    request(url)
  .post('/users')
  .send(profile)
  .end(function(err, res) {
          if (err) {
            throw err;
          }
          (res.status).should.equal(500);
          done();
        });
    });

    //test geting all user
    it('7. Test GET ALL users: should return status 200 ', function(done) {
    var profile ={};
    request(url)
    .get('/users')
    .send(profile)
    .end(function(err, res) {
            if (err) {
              throw err;
            }
            (res.status).should.equal(200);
            done();
          });
    });

    //test geting user by id
    it('8. Test GET user by valid ID: should return status 200 ', function(done) {
      var profile ={};
    request(url)
    .get('/users/'+UserID)
    .send(profile)
    .end(function(err, res) {
            if (err) {
              throw err;
            }
            (res.status).should.equal(200);
            done();
          });
    });

    //test geting user by Invalid id
    it('9. Test GET user by Invalid ID: should return status 500 ', function(done) {
      var profile ={};
    request(url)
    .get('/users/5482d1c3631c3c4239a5b8d7ffff')
    .send(profile)
    .end(function(err, res) {
            if (err) {
              throw err;
            }
            (res.status).should.equal(500);
            done();
          });
    });

    //testing GET all category
     it('10. Test GET all categories : should return status 200 ', function(done) {
      var profile ={};
    request(url)
    .get('/category')
    .send(profile)
    .end(function(err, res) {
            if (err) {
              throw err;
            }
            (res.status).should.equal(200);
            done();
          });
    });


     //testing POST categories 
    it('11. Test POST categories : should return status 200 ', function(done) {
    var profile ={
      "categoryName": "electronics"
    };
    request(url)
    .post('/category')
    .send(profile)
    .end(function(err, res) {
            if (err) {
              throw err;
            }
            categoryID = res.body._id;
            (res.status).should.equal(200);
            done();
          });
    });

     //testing GET categories by categoryid 
    it('12. Test GET categories by categoryid : should return status 200 ', function(done) {
    var profile ={};
    request(url)
    .get('/category/'+categoryID)
    .send(profile)
    .end(function(err, res) {
            if (err) {
              throw err;
            }
            (res.status).should.equal(200);
            done();
          });
    });

     //testing GET categories by invalid categoryid
    it('13. Test GET categories by invalid categoryid : should return status 500 ', function(done) {
    var profile ={};
    request(url)
    .get('/category/5485540f87f61678741ll3afe2')
    .send(profile)
    .end(function(err, res) {
            if (err) {
              throw err;
            }
            (res.status).should.equal(500);
            done();
          });
    });

    //testing POST product with valid UserID
    it('14. Test POST product : should return status 200 ', function(done) {
    var profile ={
      "userId": UserID,
      "productName":"apple",
      "productDesc":"organic,sweet and healthy",
      "expectedOffer":"some other fruit in return",
      "quantity":100,
      "isValid":true,
      "productExpiryDate":productExpiryDate
    };
    request(url)
    .post('/category/'+categoryID+'/products')
    .send(profile)
    .end(function(err, res) {
            if (err) {
              throw err;
            }
            productID = res.body._id;
            (res.status).should.equal(200);
            done();
          });
    });

    //testing POST product with Invalid UserID
    it('15. Test POST product with Invalid UserID: should return status 500 ', function(done) {
    var profile ={
      "userId":"5482d1c3631c3c4239a5b8d7ddd",
      "productName":"apple",
      "productDesc":"organic,sweet and healthy",
      "expectedOffer":"some other fruit in return",
      "quantity":100,
      "isValid":true,
      "productExpiryDate":"12-8-2014"
    };
    request(url)
    .post('/category/'+categoryID+'/products')
    .send(profile)
    .end(function(err, res) {
            if (err) {
              throw err;
            }
            (res.status).should.equal(500);
            done();
          });
    });

    //testing POST product with Invalid categoryID
    it('16. Test POST product  with Invalid categoryID: should return status 500 ', function(done) {
    var profile ={
      "userId":"5482d1c3631c3c4239a5b8d7ddd",
      "productName":"apple",
      "productDesc":"organic,sweet and healthy",
      "expectedOffer":"some other fruit in return",
      "quantity":100,
      "isValid":true,
      "productExpiryDate":"12-8-2014"
    };
    request(url)
    .post('/category/5485540f87f616787413afe2777/products')
    .send(profile)
    .end(function(err, res) {
            if (err) {
              throw err;
            }
            (res.status).should.equal(500);
            done();
          });
    });

    //testing GET all product 
    it('17. Test GET all product : should return status 200 ', function(done) {
    var profile ={};
    request(url)
    .get('/category/'+categoryID+'/products')
    .send(profile)
    .end(function(err, res) {
            if (err) {
              throw err;
            }
            (res.status).should.equal(200);
            done();
          });
    });

    //testing GET all product with Invalid categoryID
    it('18. Test GET all product with Invalid categoryID: should return status 500 ', function(done) {
    var profile ={};
    request(url)
    .get('/category/5485540f87f616787413afe2999/products')
    .send(profile)
    .end(function(err, res) {
            if (err) {
              throw err;
            }
            (res.status).should.equal(500);
            done();
          });
    });

    //testing GET all product with productID and categoryID
    it('19. Test GET  product with productID: should return status 200 ', function(done) {
    var profile ={};
    request(url)
    .get('/category/'+categoryID+'/products/'+productID)
    .send(profile)
    .end(function(err, res) {
            if (err) {
              throw err;
            }
            (res.status).should.equal(200);
            done();
          });
    });

    //testing GET all product with Invalid productID  
    it('20. Test GET product with Invalid productID: should return status 500 ', function(done) {
    var profile ={};
    request(url)
    .get('/category/5485540f87f616787413afe2/products/54855edb87f616787413affbqq')
    .send(profile)
    .end(function(err, res) {
            if (err) {
              throw err;
            }
            (res.status).should.equal(500);
            done();
          });
    });

   

    //testing GET all product with productID  
    it('23. Test GET all offers on a valid productID and categoryID: should return  status 200 ', function(done) {
    var profile ={};
    request(url)
    //console.log('/category/'+categoryID+'/products/'+productID+'/offers')
    .get('/category/'+categoryID+'/products/'+productID+'/offers')
    .send(profile)
    .end(function(err, res) {
            if (err) {
              throw err;
            }
            (res.status).should.equal(200);
            done();
          });
    });

    //testing POST an offer for a product
    it('24. testing POST an offer for a product: should return  status 200 ', function(done) {
    var profile ={
      "buyerId": buyerID,
      "buyingQty":4,
      "offeredDetails":"test",
      "status":"valid",
      "offerExpiry":"12-4-2014"
    };
    request(url)
    .post('/category/'+categoryID+'/products/'+productID+'/offers')
    .send(profile)
    .end(function(err, res) {
            if (err) {
              throw err;
            }
            offerID = res.body._id;
            (res.status).should.equal(200);
            done();
          });
    });

  //testing GET an offer with offerID
    it('25. testing GET an offer with offerID: should return  status 200 ', function(done) {
    var profile ={
    };
    request(url)
    .get('/category/'+categoryID+'/products/'+productID+'/offers/'+offerID)
    .send(profile)
    .end(function(err, res) {
            if (err) {
              throw err;
            }
            (res.status).should.equal(200);
            done();
          });
    });

    //testing GET an offer with Invalid offerID
    it('26. testing GET an offer with Invalid offerID: should return  status 500 ', function(done) {
    var profile ={
    };
    request(url)
    .get('/category/5485540f87f616787413afe2/products/54855d3787f616787413afeb/offers/548577cc87f61678741ff3b096')
    .send(profile)
    .end(function(err, res) {
            if (err) {
              throw err;
            }
            (res.status).should.equal(500);
            done();
          });
    });

    
     //testing GET all comments
    it('27. testing GET all comments: should return  status 200 ', function(done) {
    var profile ={
    };
    request(url)
    .get('/category/'+categoryID+'/products/'+productID+'/offers/'+offerID+'/comments')
    .send(profile)
    .end(function(err, res) {
            if (err) {
              throw err;
            }
            (res.status).should.equal(200);
            done();
          });
    });


    //testing POST comments
    it('28. testing POST comments: should return  status 200 ', function(done) {
    var profile ={
      "comment": "test comment",
      "userId": UserID
    };
    request(url)
    .post('/category/'+categoryID+'/products/'+productID+'/offers/'+offerID+'/comments')
    .send(profile)
    .end(function(err, res) {
            if (err) {
              throw err;
            }
            commentID = res.body._id;
            (res.status).should.equal(200);
            done();
          });
    });

     //testing GET comments with commentID
    it('29. testing GET comments with commentID: should return  status 200 ', function(done) {
    var profile ={};
    request(url)
    .get('/category/'+categoryID+'/products/'+productID+'/offers/'+offerID+'/comments/'+commentID)
    .send(profile)
    .end(function(err, res) {
            if (err) {
              throw err;
            }
            (res.status).should.equal(200);
            done();
          });
    });

    //testing GET comments with Invalid commentID
    it('30. testing GET comments with Invalid commentID: should return  status 500 ', function(done) {
    var profile ={};
    request(url)
    .get('/category/5485540f87f616787413afe2/products/54855d3787f616787413afeb/offers/548577bb87f616787413b095/comments/54857fff87f616787413b0d7ss')
    .send(profile)
    .end(function(err, res) {
            if (err) {
              throw err;
            }
            (res.status).should.equal(500);
            done();
          });
    });


     //testing DELETE an offer with offerID
    it('27. testing DELETE an offer with offerID: should return  status 200 ', function(done) {
    var profile ={
    };
    request(url)
    .delete('/category/'+categoryID+'/products/'+productID+'/offers/'+offerID)
    .send(profile)
    .end(function(err, res) {
            if (err) {
              throw err;
            }
            (res.status).should.equal(200);
            done();
          });
    });

    //testing DELETE an offer with Invalid offerID
    it('28. testing DELETE an offer with Invalid offerID: should return  status 500 ', function(done) {
    var profile ={
    };
    request(url)
    .delete('/category/5485540f87f616787413afe2/products/54855d3787f616787413afeb/offers/548577cc87f61678741ff3b096')
    .send(profile)
    .end(function(err, res) {
            if (err) {
              throw err;
            }
            (res.status).should.equal(500);
            done();
          });
    });


     //testing GET all product with Invalid productID  
    it('21. Test DELETE product with valid productID: should return status 200 ', function(done) {
    var profile ={};
    request(url)
    .delete('/category/'+categoryID+'/products/'+productID)
    .send(profile)
    .end(function(err, res) {
            if (err) {
              throw err;
            }
            (res.status).should.equal(200);
            done();
          });
    });


    //testing DELETE all product with productID  
    it('22. Test DELETE product with Invalid productID: should return status 500 ', function(done) {
    var profile ={};
    request(url)
    .delete('/category/5485540f87f616787413afe2/products/54855d5587f616787413afec999')
    .send(profile)
    .end(function(err, res) {
            if (err) {
              throw err;
            }
            (res.status).should.equal(500);
            done();
          });
    });


  });
});