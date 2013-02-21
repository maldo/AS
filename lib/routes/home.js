var db = require('../db');
var log = require('../log');

module.exports = function (app) {

	// root page
	app.get('/', function (req, res) {

		if (req.session.authenticated) {
			res.redirect('/home');
		} else {
			res.render('index');
		}
	});

	app.get('/home', function (req, res) {

		if (req.session.authenticated) {
			res.render('home', {
				user : req.session.user
			});
		} else {
			res.redirect('/');
		}
	});

	app.post('/login', function (req, res) {
		db.users.findByUsername(req.body.username, function (err, user) {
			if (!user) {
				res.redirect('/');
			} else {
				if (user.password === req.body.password) {
					req.session.authenticated = true;
					req.session.user = user;

					if (req.session.returnTo) {
						res.redirect(req.session.returnTo);
						req.session.returnTo = null;
					} else {
						res.redirect('/home');
					}
				} else {
					res.redirect('/');
				}
			}
		});
	});

	app.post('/logout', function (req, res) {
		req.session.authenticated = false;
		req.session.user = undefined;
		res.redirect('/');
	});
};