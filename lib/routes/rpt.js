var passport = require('passport');
var utils = require('../utils');
var util = require('util');
var db = require('../db');

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

				var rpt = utils.uid(64);
				var permissions = '';

				db.rpts.save(rpt, user.id, info.clientID, permissions, function (err) {
					if (err) {
						return res.json(401, {error:"muy grande"}); 
					}
					res.json(201, {rpt : rpt});
				});
			});
		})(req, res, next);
	});
};