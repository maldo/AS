var db = require('../db');

module.exports = function (app) {

	app.get('/signup', function (req, res) {
		res.render('signup');
	});

	app.post('/signup', function (req, res) {

		//Verificar que todos los campos sean correctos antes de guardarlos

		var fieldsToSet = {
			uid: db.User.generateUid(),
			email: req.body.email,
			name: req.body.name,			
			password: db.User.encryptPassword(req.body.password),
			gender: req.body.gender
		};

		db.User.create(fieldsToSet, function(err, user) {
			if (err) return console.log('algo muy malo');

			req.session.authenticated = true;
			req.session.user = user;

			res.redirect('/home');
		});
	});
}