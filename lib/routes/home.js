var user = require('../user');
var log = require('../log');

module.exports = function(app) {

	// home page
	app.get('/', function(req, res) {
		res.render('index');
	});

	app.get('/home', function (req, res) {

		if (req.session.isLogin)
		{
			res.render('home', {
				user : req.session.user
			});
		}
		else
		{
			res.redirect('/');
		}
	});

	app.post('/login', function (req, res) {
		
		log.debug('request body?')(req.body);

		user.findByUsername(req.body.username, function (user){
			if (!user){
				res.redirect('/');
			} else {
				if (user.password === req.body.password)
				{
					req.session.isLogin = true;
					req.session.user = user.data;
					res.redirect('/home');
				} else {
					res.redirect('/');
				}
			}
		});
	});

	app.post('/logout', function (req, res) {
		req.session.isLogin = false;
		req.session.user = undefined;
		res.redirect('/');
	});

}