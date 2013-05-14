var db = require('../db');
var log = require('../log');
var validate = require('../validatorFields');

module.exports = function (app) {

	app.get('/signup', function (req, res) {
		res.render('signup');
	});

	app.post('/signup', function (req, res) {

		if (!validate.name(req.body.name)) {
			return res.render('signup', {
				name: 'Please provide a valid name'
			});
		}
		if (!validate.email(req.body.email)) {
			return res.render('signup', {
				email: 'Please provide a valid email'
			});
		}
		if (!validate.password(req.body.password)) {
			return res.render('signup', {
				password:'Please provide a strong password'
			});
		}
		if (!validate.year(req.body.year)) {
			return res.render('signup', {
				date:'Please provide valid year'
			});
		}
		if (!validate.month(req.body.month)) {
			return res.render('signup', {
				date:'Please provide valid month'
			});
		}
		if (!validate.day(req.body.day)) {
			return res.render('signup', {
				date:'Please provide valid day'
			});
		}
		
		var fieldsToSet = {
			uid: db.User.generateUid(),
			email: req.body.email,
			name: req.body.name,			
			password: db.User.encryptPassword(req.body.password),
			gender: req.body.gender,
			birthday: new Date(req.body.year, req.body.month, req.body.day)
		};

		db.User.create(fieldsToSet, function(err, user) {
			if (err) {
				if (err.code === 11000) { //Duplicate key
					return res.render('signup', {
						dbkey:'This email is already registered'
					});
				} else {
					return res.render('signup', {
						dbkey:'Something really bad just happens, try it again in a couple of minutes'
					});
				}
			}

			//log.debug('Usuario nuevo')(user);

			req.session.authenticated = true;
			req.session.user = user;

			res.redirect('/home');
		});
	});
}