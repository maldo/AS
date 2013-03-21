var redis = require('./redisConnection');
var config = require('../config/config').redis;

exports.find = function (key, done) {
	
	redis.select(config.CODE, function (err) {
		redis.get(key, function (err, obj) {
			if (err) {
				return done(err);
			}
			if (!obj) {
				return done(null, null);
			}
			return done(null, JSON.parse(obj));
		});
	});
};

exports.save = function (code, obj, done) {
	
	redis.select(config.CODE, function (err) {
		redis.set(code, JSON.stringify(obj));
		redis.expire(code, config.ttl);
		return done(null);
	});
};