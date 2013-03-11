var db = require('../db');

module.exports = function (app) {

	app.get('/signup', function (req, res) {
		res.render('signup');
	});

	app.post('/signup', function (req, res) {

		var fieldsToSet = {
			uid: db.User.generateUid(),
			email: req.body.email,
			name: req.body.name,			
			password: db.User.encryptPassword(req.body.password)
		};

		db.User.create(fieldsToSet, function(err, user) {
			if (err) return console.log('algo muy malo');

			req.session.authenticated = true;
			req.session.user = user;

			res.redirect('/home');

		});

		/*db.users.findByUsername(req.body.username, function (err, user) {
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
		});*/
	});
}