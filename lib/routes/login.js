var db = require('../db');

module.exports = function (app) {

	app.get('/login', function (req, res) {
		res.render('login');
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
}