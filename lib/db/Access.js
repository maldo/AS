var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var crypto = require('crypto');

var AccessSchema = new Schema({

	time: Date,
	comment: String,
	user: String
});

mongoose.model('Access', AccessSchema);

module.exports = mongoose.model('Access');