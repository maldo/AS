var log = require('../log');
var passport = require('passport');
var GitHubStrategy = require('passport-github').Strategy;
var config = require('../config/config');
var db = require('../db');

module.exports = function (app) {

	// Passport session setup.
	//   To support persistent login sessions, Passport needs to be able to
	//   serialize users into and deserialize users out of the session.  Typically,
	//   this will be as simple as storing the user ID when serializing, and finding
	//   the user by ID when deserializing.  However, since this example does not
	//   have a database of user records, the complete GitHub profile is serialized
	//   and deserialized.
	passport.serializeUser(function (user, done) {
		done(null, user);
	});

	passport.deserializeUser(function (obj, done) {
		done(null, obj);
	});

	// Use the GitHubStrategy within Passport.
	//   Strategies in Passport require a `verify` function, which accept
	//   credentials (in this case, an accessToken, refreshToken, and GitHub
	//   profile), and invoke a callback with a user object.
	passport.use(new GitHubStrategy({
			clientID: config.github.client_id,
			clientSecret: config.github.client_secret,
			callbackURL: config.github.callback_url
		},
		function (accessToken, refreshToken, profile, done) {
			// asynchronous verification, for effect...
			process.nextTick(function () {

				// To keep the example simple, the user's GitHub profile is returned to
				// represent the logged-in user.  In a typical application, you would want
				// to associate the GitHub account with a user record in your database,
				// and return that user instead.

				/*log.debug('debugging the profile')(profile._json);

				data.name = profile._json.name;
				data.email = profile._json.email;*/

				return done(null, profile);
			});
		}
	));

	app.get('/loginGithub', function (req, res) {
		res.redirect('/auth/github');
	});

	// GET /auth/github
	//   Use passport.authenticate() as route middleware to authenticate the
	//   request.  The first step in GitHub authentication will involve redirecting
	//   the user to github.com.  After authorization, GitHubwill redirect the user
	//   back to this application at /auth/github/callback
	app.get('/auth/github',
		passport.authenticate('github'),
		function (req, res) {
			// The request will be redirected to GitHub for authentication, so this
			// function will not be called.
	});

	// GET /auth/github/callback
	//   Use passport.authenticate() as route middleware to authenticate the
	//   request.  If authentication fails, the user will be redirected back to the
	//   login page.  Otherwise, the primary route function function will be called,
	//   which, in this example, will redirect the user to the home page.
	app.get('/auth/github/callback',
		passport.authenticate('github', { failureRedirect: '/' }),
		function (req, res) {

			var fieldsToSet = {
				uid: db.User.generateUid(),
				email: req.user._json.email,
				name: req.user._json.name
			};

			db.User.findOne({email: req.user._json.email}, function (err, user) {
				if (user)
				{
					req.session.authenticated = true;
					req.session.user = user;
					
					res.redirect('/home');
				}
				else
				{
					db.User.create(fieldsToSet, function (err, user) {
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
						req.session.authenticated = true;
						req.session.user = user;
						
						res.redirect('/home');
					});
				}
			});
		});
};