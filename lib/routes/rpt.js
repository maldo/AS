var passport = require('passport');
var utils = require('../utils');
var util = require('util');

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
				var token = utils.uid(64);
				res.json(201, {rpt : token});
			});
		})(req, res, next);
	});
};