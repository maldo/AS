var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var crypto = require('crypto');
var config = require('../../config/config');

var ClientSchema = new Schema({

	name: String,
	clientId: { type: String, unique: true }
	clientSecret: String,
	email: String,
	password: String
});


ClientSchema.statics.encryptPassword = function (password) {
	return crypto.createHash(config.security.passwordHash).update(password).digest('hex');
};

ClientSchema.statics.generateUid = function () {
	return crypto.randomBytes(config.security.userUidLength).toString('hex');
};

ClientSchema.index({ clientId: 1 }, {unique: true});
mongoose.model('Client', ClientSchema);

module.exports = mongoose.model('Client');