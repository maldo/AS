var db = require('../db');
var log = require('../log');

module.exports = function (app) {

	app.get('/signup', function (req, res) {
		res.render('signup');
	});

	app.post('/signup', function (req, res) {

		if (!validateName(req.body.name)) {
			return res.render('signup', {
				name: 'Please provide a valid name'
			});
		}

		if (!validateEmail(req.body.email)) {
			return res.render('signup', {
				email: 'Please provide a valid email'
			});
		}
		if (!validatePassword(req.body.password)) {
			return res.render('signup', {
				password:'Please provide a strong password'
			});
		}
		
		var fieldsToSet = {
			uid: db.User.generateUid(),
			email: req.body.email,
			name: req.body.name,			
			password: db.User.encryptPassword(req.body.password),
			gender: req.body.gender
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

			log.debug('Usuario nuevo')(user);

			req.session.authenticated = true;
			req.session.user = user;

			res.redirect('/home');
		});
	});
}


function validateEmail(email) {
	var re = new RegExp(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
	return re.test(email);
}

function validatePassword(password) {
	return (password.length >= 6);
}

function validateName(name) {
	return (name.length >= 6);
}