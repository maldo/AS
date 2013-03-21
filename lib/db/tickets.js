var redis = require('./redisConnection');
var config = require('../config/config').redis;

exports.find = function (key, done) {
	
	redis.select(config.TICKET, function (err) {
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

exports.save = function (tikcet, obj, done) {
	
	redis.select(config.TICKET, function (err) {
		redis.set(ticket, JSON.stringify(obj));
		redis.expire(ticket, config.ttl);
		return done(null);
	});
};
