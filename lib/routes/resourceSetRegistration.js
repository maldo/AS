var passport = require('passport');
var db = require('../db');

module.exports = function (app) {

	app.put('/uma/rsreg/resource_set/:rsid', function (req, res, next) {

		passport.authenticate('bearer', {session: false }, function (err, user, info) {
			if (err) {
				console.log('esto es algo muy malo');
				return next(err);
			}

			if (!user) {
				res.set({'www-authenticate': info + ', error_description=\"Wrong access token\"'});
				return res.send(401);
			}

			if (!req.body) {
				res.set({'Cache-Control': 'no-store'});
				return res.json({valid: false});
			}

			console.log(req.body)

			var resource = new db.Resource();
			resource.rsid = req.params.rsid;
			resource.uid = db.Resource.generateUid();
			resource.privacy = 'All';
			resource.etag = 1;
			resource.desc = req.body;
			resource.save(function (err) {
				if(err) {
					return res.json(500, {error: err});
				}

				res.set('Content-Type', 'application/intro-status+json');
				res.json(201, {
					status: "created",
					_id: resource.rsid,
					_rev: 1
				});
			});

		})(req, res, next);
	});
};