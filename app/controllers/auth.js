var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
  jwt = require('jsonwebtoken'),
  //fs = require('fs'),
  config = require('../../config/config'),
  //AES = require("crypto-js/aes"),
  //SHA256 = require("crypto-js/sha256"),
  //cryptoJS = require("crypto-js"),
  crypto = require('crypto'),
  base64url = require('base64url'),
  jsend = require('express-jsend'),
  mAuth = require('../middlewares/auth'),
  User = mongoose.model('User');

  var secret;

module.exports = function (app) {
  app.use('/auth', router);
};

/**
  * Handles login form
  * TO DO : handle login, and new user creation
  */
router.get('/login', function(req, res, next){
  // Config for UI..
  var ui = {
    view: 'form',
    id: 'loginForm',
    //width: '400',
    elements: [
      { view: 'text', label: 'username', id: 'username'},
      { view: 'text', label: 'password', type: 'password', id: 'password'},
      { margins: 5, cols: [
          { view: 'button', value: 'Login', type: 'form', id: 'loginForm.submit'}
        ]},
    ]
  };
  res.jsend(ui);
})


/**
 * Displays welcome message to the user that passes authentification, according to the token provided.
 * Tokens can be passed via URL query (with token query) or via Authorization Header.
 */
router.get('/user', mAuth.validateToken, function(req, res, next) {
    //console.log(`Unparsed payload: ${req.body}`);
    var payload = base64url.decode(req.body);
    var data = JSON.parse(payload);
    res.jsend({message: `Welcome ${data.username}`});
});

/**
  * Page that generates JSON web tokens for existing users
  *
  */
router.post('/', function (req, res, next) {
  // Check user exists
  var username = req.query.username;
  var password = req.query.password;
  User.findOne(function(err, existingUser){
    if(err){
      res.jerror(new Error('You are not authorised to be here'));
      return;
    }
    if(existingUser){
      // Send newly generated token..
      res.jsend(mAuth.generateToken(existingUser));
    } else {
      // Send error..
      res.jerror(new Error('Login fail'))
    }

  })
  
});
