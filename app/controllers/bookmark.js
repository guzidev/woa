var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
  jwt = require('jsonwebtoken'),
  fs = require('fs'),
  params = require('../../config/config'),
  //crypto = require('crypto'),
  //base64url = require('base64url'),
  //jsend = require('express-jsend'),
  Bookmark = mongoose.model('Bookmark');

module.exports = function (app) {
  app.use('/woa/bookmarks', router);
};

//router.get('/uijson', (req, res) => res.json('data'));

/** // Method that returns all Bookmarks in JSON form
router.get('/uijson', function(req, res){
  var criteria = {};
   Bookmark.find(criteria)
              .sort('value')
              .exec(function(err, bookmarks){
                if (err) {
                  res.status(500).send(err);
                  return;
                }
                //res.send(bookmarks);
  res.json(bookmarks);
});
}); 
*/

router.get('/ui', function(req, res) {
  
  var options = {
    root: __dirname + '/../views/',
    dotfiles: 'deny',
    headers: {
        'x-timestamp': Date.now(),
        'x-sent': true
    }
  };
  var fileName = 'ui.html';
  res.sendFile(fileName, options, function (err) {
    if (err) {
      console.log(err);
      res.status(err.status).end();
    }
    else {
      console.log('Sent:', fileName);
    }
  });

});

router.get('/', function(req, res, next) {
  var criteria = {};
   Bookmark.find(criteria)
              .sort('value')
              .exec(function(err, bookmarks){
                if (err) {
                  res.status(500).send(err);
                  return;
                }
                res.send(bookmarks);
              });
});

router.post('/', function(req, res, next) {
  var bookmark = new Bookmark(req.body);
  bookmark.save(function (err, createdBookmark){
    if (err){
      res.status(500).send(err);
      return;
    }
    res.send(createdBookmark);
  });

});
