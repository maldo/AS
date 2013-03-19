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
		redis.ttl(key,function (err, ttl) {
			if (err) {
				return done(null, err);
			}
			obj.ttl = ttl;
			return done(null, obj);
		});
	});
};

exports.save = function (rpt, userID, clientID, permissions, done) {
	
	var now = Date.now();

	redis.hmset(rpt, {
		userID: userID, 
		clientID: clientID, 
		permissions: permissions,
		issued_at: now.toString(),
		expires_at: (now+config.ttl).toString()
	});
	redis.expire(rpt, config.ttl);
	return done(null);
};