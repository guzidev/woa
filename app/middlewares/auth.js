var config = require('../../config/config'),
	base64url = require('base64url'),
	crypto = require('crypto'),
  	jsend = require('express-jsend'),
  	mongoose = require('mongoose'),
	User = mongoose.model('User');

/**
 * Check that the token provided is valid.
 * Tokens can be provided via :
 * 1) url query, as "token" value
 * 2) Authorization header
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
 		res.jerror('You are not authorized');
 		return;
 	}

 	// Make payload available to next function..
 	req.body = payload;

 	next();
 }