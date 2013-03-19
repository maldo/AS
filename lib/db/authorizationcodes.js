var redis = require('./redisConnection');
var config = require('../config/config').redis;

exports.find = function (key, done) {
	
	redis.hgetall(key, function (err, obj) {
		if (err) {
			return done(err);
		}
		if (!obj) {
			return done(null, null);
		}
		return done(null, obj);
	});
};

exports.save = function (code, clientID, redirectURI, userUID, done) {
	
	redis.hmset(code, {clientID: clientID, redirectURI: redirectURI, userUID: userUID});
	redis.expire(code, config.ttlCode);
	return done(null);
};
