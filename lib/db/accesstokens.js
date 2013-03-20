var redis = require('./redisConnection');
var config = require('../config/config').redis;

exports.find = function (key, done) {
	
	redis.get(key, function (err, obj) {
		if (err) {
			return done(err);
		}
		if (!obj) {
			return done(null, null);
		}
		return done(null, JSON.parse(obj));
	});
};

exports.save = function (token, obj, done) {
	
	redis.set(token, JSON.stringify(obj));
	redis.expire(token, config.ttl);
	return done(null);
};
