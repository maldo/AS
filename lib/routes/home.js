var db = require('../db');
var log = require('../log');
var agent = require('superagent');

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
			db.User
				.findById(req.session.user._id)
				.populate('regClients')
				.exec(function (err, list) {
					req.session.itemsUser = list;
					res.render('home', {
						user : list
					});
				})
		} else {
			res.redirect('/');
		}
	});

	app.post('/home/:rsid', function (req, res, next) {

		db.Resource.findOne({rsid: req.params.rsid}, function (error, resource) {
			
			resource.privacy = req.body.privacy;

			if (resource.privacy === 'Selected emails') {
				resource.privacy = req.body.privacy;
			}

			resource.save(function (error) {
				//next();
				res.redirect('/home');
			});
		});
	});

	app.post('/home', function (req, res) {
		db.UserResource
			.findOne({user: req.session.user._id, client: req.body.client})
			.populate('resources')
			.exec(function (err, list) {
				console.log(list)
				res.render('home', {
					user: req.session.itemsUser,
					resource:list
				});
			})
	});
};