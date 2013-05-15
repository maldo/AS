var passport = require('passport');
var rand = require('../cryptoRandom');
var config = require('../config/config');
var db = require('../db');

module.exports = function (app) {

	app.post('/uma/preq', function (req, res, next) {

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

			db.tickets.find(req.body.ticket, function (err, ticket) {

				if (err) {
					console.log('esto es algo muy malo');
					return next(err);
				}

				if (!ticket) {

					res.set("Content-Type",	"application/json");
					res.set("Cache-Control", "no-store");

					return res.json(400, {status: "error", 
						error: "invalid_requester_ticket"});
				}

				db.rpts.find(req.body.rpt, function (err, rpt) {
					if (err) {
						console.log('esto es algo muy malo');
						return next(err);
					}

					if (!rpt) {
						res.status(400);
						res.set("Content-Type",	"application/json");
						res.set("Cache-Control", "no-store");

						return res.json({status: "error", 
							error: "expired_ticket"});
					}

					db.Resource.findOne({client:info.clientID, rsid:ticket.rsid}, function (err, resource) {

						if(!checkPolicies(user, resource)) {
							res.set("Content-Type",	"application/json");
							res.set("Cache-Control", "no-store");

							return res.json(400, {status: "error", 
								error: "not_authorized_permission"});
						}

						resource.visits += 1;

						resource.save(function (err) {

							rpt.permissions = ticket.scopes;

							var ttl = rpt.expires_at - Date.now();

							db.rpts.saveWithTTL(req.body.rpt, rpt, ttl, function (error) {
								if (err) {
									return res.json(401, {error:"muy grande"}); 
								}
								res.send(201);
							});
						});
					});
				});			
			});
		})(req, res, next);
	});
};

function isEmptyObject(obj) {
	return !Object.keys(obj).length;
}

function checkPolicies(user, resource) {
	console.log(user);
	console.log(resource);

	var privacy = resource.privacy;

	if (privacy === 'All') {
		return true;
	} else if (privacy === '+18') {

		userAge = (user.birthday/(1000*60*60*24*365));

		if (userAge < 18) {
			return false;
		} else {
			return true;
		}
	} else if (privacy === 'Selected emails') {
		resource.emails.forEach(function (email) {
			if (email === user.email) {
				return true;
			}
		});
		return false;
	}

	return false;
}