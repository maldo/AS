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
};