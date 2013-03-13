var db = require('../db');
var log = require('../log');

module.exports = function (app) {

	app.get('/client', function (req, res) {
		if (req.session.clientAuthenticated) {
			res.render('client', {
				client:req.session.client
			});
		} else {
			res.redirect('/client/login');
		}
	});

	/*app.post('/client/signup', function (req, res) {
		//Verificar que todos los campos sean correctos antes de guardarlos

		var fieldsToSet = {
			email: req.body.email,
			name: req.body.name,
			password: db.Client.encryptPassword(req.body.password),
			clientId: db.Client.generateClientCodes(8),
			clientSecret: db.Client.generateClientCodes(16)
		};

		db.Client.create(fieldsToSet, function(err, client) {
			if (err) return console.log('algo muy malo');
			//Verificar que todos los campos sean correctos antes de guardarlos

			log.debug('Cliente nuevo')(client);

			req.session.client = client;
			res.redirect('/client');
		});
		
	});*/
};