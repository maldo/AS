var db = require('../db');
var log = require('../log');

module.exports = function (app) {

	app.get('/client/login', function (req, res) {
		if (req.session.clientAuthenticated)
		{
			res.redirect('/client');
		} else {
			res.render('clientLogin');
		}
	});

	app.post('/client/login', function (req, res) {
		db.Client.findOne({email: req.body.email}, function (err, client) {
			if (!client) {
				res.redirect('/');
			} else {
				if (client.password === db.Client.encryptPassword(req.body.password)) {
					req.session.clientAuthenticated = true;
					req.session.client = client;

					res.redirect('/client');
					
				} else {
					res.redirect('/');
				}
			}
		});
	});
}