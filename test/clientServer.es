var util = require('util');
var express = require('express');
var route = require('./route');
var log = require('./log.js');
var passport = require('passport');
var OAuth2Strategy = require('passport-oauth').OAuth2Strategy;
var co = require('./const');
var config = require('../config/endpoints');

var fs = require('fs');
var https = require('https');

// Self signed credentials
var credentials = {
    key: fs.readFileSync( __dirname +'/../cert/keys/server.key').toString(),
    cert: fs.readFileSync( __dirname +'/../cert/certs/server.crt').toString()
};

passport.use('AM', new OAuth2Strategy({
	authorizationURL: config.user_endpoint,
	tokenURL: config.token_endpoint,
	clientID: co.CLIENT_ID,
	clientSecret: co.CLIENT_SECRET,
	callbackURL: 'https://localhost:4321/oauth/AM/callback'
	},
	function (accessToken, refreshToken, profile, done) {
		process.nextTick(function () {
		 
			co.ACCESSTOKEN = accessToken;

			// To keep the example simple, the user's GitHub profile is returned to
			// represent the logged-in user.  In a typical application, you would want
			// to associate the GitHub account with a user record in your database,
			// and return that user instead.
			return done(null, profile);
		});
  	}
));

passport.serializeUser(function (user, done) {
	done(null, user);
});

passport.deserializeUser(function (obj, done) {
	done(null, obj);
});

//var agent;

var app = express();
https.createServer(credentials, app).listen(co.PORT);
console.log(co.SERVER);

// configure Express
app.configure(function() {
	app.use(express.favicon());
	app.use(express.cookieParser());
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(express.session({ secret: 'keyboard cat' }));
	// Initialize Passport!  Also use passport.session() middleware, to support
	// persistent login sessions (recommended).
	app.use(passport.initialize());
	app.use(passport.session());
	app.use(app.router);
	app.use(express.static(__dirname + '/public'));
});

/*app.all('/*', function (req, res, next) {
	log.warn(req.method)(req.url);
	log.debug('headers')(req.headers);
	log.debug('query')(req.query);
	next();
});*/

app.get('/', function (req, res) {
	res.render('index', { user: req.user });
});

app.get('/account', ensureAuthenticated, function (req, res) {
	res.render('account', { user: req.user });
});

app.get('/login', function (req, res) {
	res.render('login', { user: req.user });
});

app.get('/fail', function (req, res) {
	res.send('You have denied access to the AM');
});

app.get('/oauth/AM', passport.authenticate('AM'),
	function(req, res){

	//log.debug('request query in get /auth/AM')(req.query);
	// The request will be redirected to GitHub for authentication, so this
	// function will not be called.
});

// GET /auth/github/callback
app.get('/oauth/AM/callback', 
	passport.authenticate('AM', { failureRedirect: '/fail' }),
	function (req, res) {

		log.debug('lo que llega es')(req.query);
		res.send(req.query);
});

app.get('/logout', function(req, res){
	req.logout();
	res.redirect('/');
});

// Simple route middleware to ensure user is authenticated.
function ensureAuthenticated(req, res, next) {
	if (req.isAuthenticated()) { return next(); }
	res.redirect('/login')
}