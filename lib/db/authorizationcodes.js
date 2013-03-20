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

exports.save = function (code, obj, done) {
	
	redis.set(code, JSON.stringify(obj));
	redis.expire(code, config.ttlCode);
	return done(null);
};
