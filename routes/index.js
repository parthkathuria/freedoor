var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
mongoose.model('users',{name: String});
/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});

/* GET home page. */
router.get('/users', function(req, res) {
  mongoose.model('users').find(function(err,users){
  	res.send(users);
  });
});

router.post('/users', function(req, res) {
  mongoose.model('users').insert({function(err,users){
  	res.send(users);
  });
});

/* POST Create Users*/
router.post('/user', function(req,res){

});

/* GET User by ID*/
router.get('/user/:id', function(req, res){

});

module.exports = router;
