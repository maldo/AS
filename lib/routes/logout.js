module.exports = function (app) {
	app.post('/logout', function (req, res) {
		req.session.authenticated = false;
		req.session.user = undefined;		
		res.redirect('/');
	});
}