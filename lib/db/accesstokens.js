var redis = require('./redisConnection');
var config = require('../../config/config').redis;


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

exports.save = function (token, userID, clientID, done) {
	
	redis.hmset(token, {userID: userID, clientID: clientID});
	redis.expire(token, config.ttl);
	return done(null);
};
