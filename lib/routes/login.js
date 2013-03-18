var db = require('../db');
var log = require('../log');

module.exports = function (app) {

	app.get('/login', function (req, res) {
		if (req.session.authenticated) {
			res.redirect('/home');
		} else {
			res.render('login');
		}
	});

	app.post('/login', function (req, res) {
		db.User.findOne({email: req.body.email}, function (err, user){
			if (!user) {
				res.redirect('/');
			} else {
				if (user.password === db.User.encryptPassword(req.body.password)) {
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
}