var db = require('../db');
var log = require('../log');
var validate = require('../validatorFields');

module.exports = function (app) {

	// root page
	app.get('/client/signup', function (req, res) {
		res.render('clientSignup');
	});

	app.post('/client/signup', function (req, res) {
		
		console.log(req.body);

		if (!validate.name(req.body.name)) {
			return res.render('clientSignup', {
				name: 'Please provide a valid name'
			});
		}
		if (!validate.email(req.body.email)) {
			return res.render('clientSignup', {
				email: 'Please provide a valid email'
			});
		}
		if (!validate.password(req.body.password)) {
			return res.render('clientSignup', {
				password:'Please provide a strong password'
			});
		}
		if (!validate.url(req.body.murl)) {
			return res.render('clientSignup', {
				murl:'Please provide a valid url'
			});
		}
		if (!validate.url(req.body.curl)) {
			return res.render('clientSignup', {
				curl:'Please provide a valid url'
			});
		}

		var fieldsToSet = {
			email: req.body.email,
			name: req.body.name,
			password: db.Client.encryptPassword(req.body.password),
			clientId: db.Client.generateClientCodes(8),
			clientSecret: db.Client.generateClientCodes(16),
			murl: req.body.murl,
			curl: req.body.curl
		};

		db.Client.create(fieldsToSet, function(err, client) {
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

			log.debug('Cliente nuevo')(client);

			req.session.clientAuthenticated = true;
			req.session.client = client;
			res.redirect('/client');
		});
		
	});
};