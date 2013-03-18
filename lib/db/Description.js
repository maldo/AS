var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var crypto = require('crypto');

var DescriptionSchema = new Schema({

	name: String,
	icon_uri: String,
	scopes: [String]
});

mongoose.model('Description', DescriptionSchema);

module.exports = mongoose.model('Description');