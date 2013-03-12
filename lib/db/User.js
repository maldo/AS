var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var crypto = require('crypto');
var config = require('../../config/config');

var UserSchema = new Schema({

	uid: { type: String, unique: true },
	name: String,
	email: { type: String, unique: true },
	birthday: Date,
	gender: String,
	password: String
});


UserSchema.statics.encryptPassword = function (password) {
	return crypto.createHash(config.security.passwordHash).update(password).digest('hex');
};

UserSchema.statics.generateUid = function () {
	return crypto.randomBytes(config.security.randomCryptoLength).toString('hex');
};

UserSchema.index({ uid: 1 }, {unique: true});
UserSchema.index({ email: 1 }, {unique: true});
mongoose.model('User', UserSchema);

module.exports = mongoose.model('User');