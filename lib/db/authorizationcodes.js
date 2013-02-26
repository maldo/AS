var redis = require('./redisConnection');

var codes = {};


exports.find = function (key, done) {
	/*var code = codes[key];
	return done(null, code);*/
	redis.hgetall(key, function (err, obj) {
		if (err) {
			return done(null, err);
		}
		if (!obj) {
			return done(null, null);
		}
		return done(null, obj);
	});
};

exports.save = function (code, clientID, redirectURI, userID, done) {
	/*codes[code] = { clientID: clientID, redirectURI: redirectURI, userID: userID };
	return done(null);*/

	redis.hmset(code, {clientID: clientID, redirectURI: redirectURI, userID: userID});
	redis.expire(code, 120);
	return done(null);
};
