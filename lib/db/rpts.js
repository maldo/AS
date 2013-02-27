var redis = require('./redisConnection');

var rpts = {};


exports.find = function (key, done) {
	/*var rpt = rpts[key];
	return done(null, rpt);*/
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
	/*rpts[rpt] = { userID: userID, clientID: clientID };
	return done(null);*/

	var now = Date.now();

	redis.hmset(rpt, {
		userID: userID, 
		clientID: clientID, 
		permissions: permissions,
		issued_at: now.toString(),
		expires_at: (now+3600).toString()
	});
	redis.expire(rpt, 3600);
	return done(null);
};