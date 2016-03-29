var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
  jwt = require('jsonwebtoken'),
  fs = require('fs'),
  mAuth = require('../middlewares/auth'),
  //crypto = require('crypto'),
  //base64url = require('base64url'),
  //jsend = require('express-jsend'),
  Bookmark = mongoose.model('Bookmark');

module.exports = function (app) {
  app.use('/woa/bookmarks', router);
};

/**
 * Handles user interface content..
 * version 1
 */
// router.get('/ui', function(req, res) {
  
//   var options = {
//     root: __dirname + '/../views/',
//     dotfiles: 'deny',
//     headers: {
//         'x-timestamp': Date.now(),
//         'x-sent': true
//     }
//   };
//   var fileName = 'ui.html';
//   res.sendFile(fileName, options, function (err) {
//     if (err) {
//       console.log(err);
//       res.status(err.status).end();
//     }
//     else {
//       console.log('Sent:', fileName);
//     }
//   });
// });

/**
 * Handles user interface content..
 * version 2
 */
router.get('/ui', function(req, res, next){
  ui = {
    view:"tree",
    data: [
        { id:"branch1", value:"The Shawshank Redemption", data:[
            { id:"part1", value:"Part 1" },
            { id:"part2", value:"Part 2" }
        ]},
        { id:"branch2", value:"Another Shawshank Redemption", data:[
            { id:"part1", value:"Part 1" },
            { id:"part2", value:"Part 2" }
        ]},
    ]
  };
  res.jsend(ui); 
 });

/**
 * Return all bookmarks.
 * Token required
 */
router.get('/', mAuth.validateToken, function(req, res, next) {
  var criteria = {};
  // insert code to set criteria.
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

/**
 * Return all Bookmarks in JSON form (explicit)
 * Token required
 */
router.get('/json', function(req, res){
  var criteria = {};
   Bookmark.find(criteria)
              .sort('value')
              .exec(function(err, bookmarks){
                if (err) {
                  res.status(500).send(err);
                  return;
                }
  res.json(bookmarks);
});

/**
 * Create a bookmark from provided information in body.
 * User must have a valid token
 */
router.post('/', mAuth.validateToken, function(req, res, next) {
  var bookmark = new Bookmark(req.body);
  bookmark.save(function (err, createdBookmark){
    if (err){
      res.status(500).send(err);
      return;
    }
    res.jsend(createdBookmark);
  });

});

/**
 * Modify a bookmark from provided information in body.
 * User must have a valid token
 */
router.put('/:id', mAuth.validateToken, function(req, res, next) {
  var bookmark = new Bookmark(req.body);
  // insert code to update bookmark...
    res.jsend('modifiedBookmark');
  });

});
