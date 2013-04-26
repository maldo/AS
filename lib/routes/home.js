var db = require('../db');
var log = require('../log');
var agent = require('superagent');
var validate = require('../validatorFields');

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
				});
		} else {
			res.redirect('/');
		}
	});

	app.get('/home/:name', function (req, res) {

		db.Client.findOne({name: req.params.name}, function (error, client) {
			console.log(client);
			db.UserResource
				.findOne({user: req.session.user._id, client: client._id })
				.populate('resources')
				.exec(function (err, list) {
					//console.log(list);
					res.render('resources', {
						server: client.name,
						user: req.session.user,
						resource: list
					});
				});
		});
	});

	app.post('/home/:name/:rsid', function (req, res) {

		db.Resource.findOne({rsid: req.params.rsid}, function (error, resource) {

			if (req.body.privacy === 'Selected emails' && req.body.emails === '') {
				console.log('avisar error o que rellene los mails o algo');
				// TODO return o algo
			} else if (req.body.privacy === 'Selected emails' && req.body.emails !== '') {
				var str = req.body.emails;

				str = str.replace(/(\r\n|\n|\r|\s)/gm, "");

				var arrayEmails = str.split(',');

				var arrayTemp = [];

				for (var i = 0; i < arrayEmails.length; i++) {
					if (validate.email(arrayEmails[i])) {
						arrayTemp.push(arrayEmails[i]);
					} else {
						console.log('raise error')
					}
				}
				resource.emails = arrayTemp;
			}

			resource.privacy = req.body.privacy;

			resource.save(function (error) {
				res.redirect('/home/'+req.params.name+'/'+req.params.rsid);
			});
		});
	});


	app.get('/home/:name/:rsid', function (req, res) {

		db.Resource.findOne({rsid: req.params.rsid}, function (error, resource) {
			
			console.log(resource);
			if (resource.privacy === "Selected emails") {
				res.render('resource', {
					user: req.session.user,
					server: req.params.name,
					resource: resource,
					listEmail: resource.emails
				});
			}
			else {
				res.render('resource', {
						user: req.session.user,
						server: req.params.name,
						resource: resource
					});
			}
		});
	});
};