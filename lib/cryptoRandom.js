exports.generateCryptoUid = function(len) {
	return require('crypto').randomBytes(len).toString('hex');
}