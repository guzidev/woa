// Bookmark model

var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var BookmarkSchema = new Schema({
  title: 		{ type: String, required: true },
  url: 			{ type: String, required: true }
}); 

mongoose.model('Bookmark', BookmarkSchema);

