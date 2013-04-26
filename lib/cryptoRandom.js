exports.generateCryptoUid = function(len) {
	return require('crypto').randomBytes(len||4).toString('hex');
}