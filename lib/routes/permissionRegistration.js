var passport = require('passport');
var rand = require('../cryptoRandom');
var config = require('../config/config');

module.exports = function (app) {

	app.post('/uma/preg/host/scope_reg_uri/:clientID', function (req, res, next) {

		passport.authenticate('bearer', {session: false }, function (err, user, info) {

			if (err) {
				console.log('esto es algo muy malo');
				return next(err);
			}

			if (!user) {
				res.set({"www-authenticate":
					'Bearer realm=\"Users\", error=\"invalid_token\", error_description=\"Wrong access token\"'
					});
				return res.send(401);
			}

			if (!req.body) {
				res.set({'Cache-Control': 'no-store'});
				return res.json({valid: false});
			}

			console.log(req.body);

			var ticket = rand.generateCryptoUid(16);

			res.location(config.app.server + '/uma/preg/host/scope_reg_uri/' + req.params.clientID + '/' + req.body.resource_set_id);
			res.json(201, {ticket: ticket});

		})(req, res, next);
	});
};