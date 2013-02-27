var passport = require('passport');
var db = require('../db');
var util = require('util');

module.exports = function (app) {

	app.post('/uma/rptstat', function (req, res, next) {

		passport.authenticate('bearer', {session: false }, function (err, user, info) {

			if (err) {
				console.log('esto es algo muy malo');
				return next(err);
			}

			if (!user) {
				res.set({"www-authenticate": info+', error_description=\"Wrong access token\"'});
				return res.send(401);
			}

			if (!req.body) {
				res.set({"Cache-Control": "no-store"});
				return res.json({valid: false});
			}

			db.rpts.find(req.body.rpt, function (err, rpt) {

				if (err) {
					console.log('esto es algo muy malo');
					return next(err);
				}

				if (!rpt) {
					res.set({"Cache-Control": "no-store"});
					return res.json({valid: false});
				}

				res.json({
					valid: true,
					expires_at: rpt.expires_at,
					issued_at: rpt.issued_at,
					permissions: rpt.permissions
				});
			});

		})(req, res, next);
	});
};