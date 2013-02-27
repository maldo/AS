var redis = require('./redisConnection');

var tokens = {};


exports.find = function (key, done) {
	/*var token = tokens[key];
	return done(null, token);*/
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
	/*tokens[token] = { userID: userID, clientID: clientID };
	return done(null);*/

	redis.hmset(token, {userID: userID, clientID: clientID});
	redis.expire(token, 3600);
	return done(null);
};
