// Bookmark model

var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var BookmarkSchema = new Schema({
  title: 		{ type: String, required: true },
  url: 			{ type: String, required: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true }
}); 

mongoose.model('Bookmark', BookmarkSchema);

