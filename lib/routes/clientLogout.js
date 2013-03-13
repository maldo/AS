module.exports = function (app) {
	app.post('/client/logout', function (req, res) {
		req.session.clientAuthenticated = false;
		req.session.client = undefined;		
		res.redirect('/');
	});
}