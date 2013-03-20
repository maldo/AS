var passport = require('passport');
var rand = require('../cryptoRandom');
var db = require('../db');
var config = require('../config/config')

module.exports = function (app) {

	app.post('/uma/rpt', function (req, res, next) {

		passport.authenticate('bearer', {session: false }, function (err, user, info) {
			if (err) {
				return next(err);
			}
			if (!user) {

				res.set({"www-authenticate":
					'UMA realm=\"AS\",error=\"invalid_token\",error_description=\"Wrong access token\"'
					});
				return res.send(401);
			}

			req.logIn(user, function (err) {
				if (err) {
					return next(err);
				}

				var rpt = rand.generateCryptoUid(64);
				var permissions = '';

				var now = Date.now();

				var obj = {
					userID: user.uid, 
					clientID: info.clientID, 
					permissions: '',
					issued_at: now.toString(),
					expires_at: (now+config.redis.ttl).toString()
				}

				db.rpts.save(rpt, obj, function (err) {
					if (err) {
						return res.json(401, {error:"muy grande"}); 
					}
					res.json(201, {rpt : rpt});
				});
			});
		})(req, res, next);
	});
};

