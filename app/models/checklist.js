// Checklist model

var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var ChecklistSchema = new Schema({
  tasks: [{
  	name: { type: String, required: true },
  	order: { type: Number, required: true },
  	completed: { type: Boolean, required: true, default: false },
  }]
});

