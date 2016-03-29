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


function getUi (req, res, next) {
  var ui;
  // to do...

  res.send(ui);
}


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
  * 
  *
  */
router.post('/', function (req, res, next) {
  // check user exists
  var username = req.query.username;
  var password = req.query.password;

  User.findOne(function(err, existingUser){
    if(err){
      res.jerror(new Error('You are not authorised to be here'));
      return;
    }

    // Generate JW Token..
    if(existingUser){
      var header = {
        "alg": "HS256",
        "typ": "JWT"
      }
      var payload = {
          "username": username,
          "password": password
      }

      console.log(`Secret: ${config.secret}`);

      var signature = crypto.createHmac('sha256', config.secret)
        .update(base64url(JSON.stringify(header)) + "." +
                base64url(JSON.stringify(payload)))
        .digest('bin');

      var newToken = base64url(JSON.stringify(header)) + "." +
                  base64url(JSON.stringify(payload)) + "." +
                  base64url(signature);

                  //console.log(`Token: ${token}`);
      res.jsend(newToken);
    } else {
      res.jerror(new Error('Login fail'))
    }

  })
  
});
