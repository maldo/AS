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
					res.render('home', {
						user : list
					});
				})
		} else {
			res.redirect('/');
		}
	});


	app.get('/home/:name', function (req, res) {

		db.Client.findOne({name:req.params.name}, function (error, client) {
			console.log(client);
			db.UserResource
				.findOne({user: req.session.user._id, client: client._id })
				.populate('resources')
				.exec(function (err, list) {
					console.log(list);
					res.render('resources', {
						server: client.name,
						user: req.session.user,
						resource: list
					});
				})
		})
	});

	app.post('/home/:name/:rsid', function (req, res) {

		db.Resource.findOne({rsid: req.params.rsid}, function (error, resource) {
			
			resource.privacy = req.body.privacy;

			if (resource.privacy === 'Selected emails') {
				resource.privacy = req.body.privacy;
			}

			resource.save(function (error) {
				res.redirect('/home/'+req.params.name);
			});
		});
	});


	app.get('/home/:name/:rsid', function (req, res) {

		db.Resource.findOne({rsid: req.params.rsid}, function (error, resource) {
			
			console.log(resource);

			res.render('resource', {
						server: req.params.name,
						resource: resource
					});
		});
	});

};