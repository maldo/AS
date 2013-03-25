var redis = require('./redisConnection');
var config = require('../config/config').redis;

exports.find = function (key, done) {
	
	redis.select(config.RPT, function (err) {
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

exports.save = function (rpt, obj, done) {
	
	redis.select(config.RPT, function (err) {
		redis.set(rpt, JSON.stringify(obj));
		redis.expire(rpt, config.ttl);
		return done(null);
	});
};

exports.saveWithTTL = function (rpt, obj, ttl, done) {
	redis.select(config.RPT, function (err) {
		redis.set(rpt, JSON.stringify(obj));
		redis.expire(rpt, ttl);
		return done(null);
	});
}