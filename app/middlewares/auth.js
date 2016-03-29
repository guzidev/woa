var config = require('../../config/config'),
	base64url = require('base64url'),
	crypto = require('crypto'),
  	jsend = require('express-jsend'),
  	mongoose = require('mongoose'),
  	jwt = require('jsonwebtoken'),
	User = mongoose.model('User');


  var secret;

/**
 * Check that the token provided is valid.
 * Tokens can be provided via :
 * 1) url query, as "token" value
 * 2) Authorization header
 * TO DO : handle limited validity date for tokens
 */
 module.exports.validateToken = function(req, res, next) {
 	var token;
 	// Check token provided in url query or in header..
 	if(!req.query.token) {
 		if (!req.get('Authorization')) {
 			res.jerror('Authentification token must be provided');
 			return;
 		}
 		// Token provided in header, split token..
 		token = req.get('Authorization').split('.');
 	} else {
 		// Token provided in url query, split token..
 		token = req.query.token.split('.');
 	}

 	// Check token format is valid..
 	if (token.length != 3) {
 		res.jerror('Token provided is not valid');
 		return;
 	}

 	// Generate signature from provided token..
 	var header = token[0];
 	var payload = token[1];
 	var providedSignature = token[2];

 	var signature = crypto.createHmac('sha256', config.secret).update(header + "." + payload).digest('bin');
 	console.log(`Signature: ${signature}`);
 	var generatedSignature = base64url(signature);
 	console.log(`Generated signature: ${generatedSignature}`);

 	// Compare generated signature to provided signature..
 	if (generatedSignature != providedSignature) {
 		res.jerror('You are not authorized (maybe check signatures)');
 		return;
 	}

 	// Make payload available to next function..
 	req.body = payload;

 	next();
 }

/**
 * Check that the token provided is valid.
 * TO DO
 */
module.exports.validateSocketToken = function(socket, next){
    // insert code, similar to validateToken, but for WS
}
 
/**
 * Generate a token corresponding to the user information provided
 * User info must include "username" and "password"
 */
 module.exports.generateToken = function(userInfo) {
 	      var header = {
        "alg": "HS256",
        "typ": "JWT"
      }

      console.log(`Usr: ${userInfo.username}`);
      var payload = {
          "username": userInfo.username,
          "password": userInfo.password
      }

      console.log(`Secret: ${config.secret}`);

      var signature = crypto.createHmac('sha256', config.secret)
        .update(base64url(JSON.stringify(header)) + "." +
                base64url(JSON.stringify(payload)))
        .digest('bin');

      var newToken = base64url(JSON.stringify(header)) + "." +
                  base64url(JSON.stringify(payload)) + "." +
                  base64url(signature);

                  console.log(`Generate token: ${newToken}`);
      return newToken;
      // next();
 }

