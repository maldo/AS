var redis = require('./redisConnection');
var config = require('../config/config');

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

exports.save = function (rpt, obj, done) {
	
	redis.set(rpt, JSON.stringify(obj));
	redis.expire(rpt, config.redis.ttl);
	return done(null);
};