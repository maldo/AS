var passport = require('passport');
var rand = require('../cryptoRandom');
var config = require('../config/config');
var db = require('../db');

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

			if (isEmptyObject(req.body)) {
				res.set({'Cache-Control': 'no-store'});
				return res.json(400, {valid: false});
			}

			//console.log(req.body);
			//console.log(info);

			var ticket = rand.generateCryptoUid(16);

			var obj = {
				client_id : info.clientID,
				user_id : user._id,
				rsid : req.body.resource_set_id,
				scopes : req.body.scopes
			}

			db.tickets.save(ticket, obj, function (err) {
				if (err) {
					return res.json(401, {error:"muy grande"}); 
				}
				//res.set('Content-Type', 'application/uma-permission-ticket+json');
				res.location(config.app.server + '/uma/preg/host/scope_reg_uri/' + req.params.clientID + '/' + req.body.resource_set_id);
				res.json(201, {ticket: ticket});
			});
		})(req, res, next);
	});
};

function isEmptyObject(obj) {
	return !Object.keys(obj).length;
}