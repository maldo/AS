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
};