var express = require('express');
var fs = require('fs');
var https = require('https');
var config = require('./config/config');
var dust = require('dustjs-linkedin');
var cons = require('consolidate');
var winston = require('winston');

// Self signed credentials
var credentials = {
    key: fs.readFileSync( __dirname +'/cert/keys/server.key').toString(),
    cert: fs.readFileSync( __dirname +'/cert/certs/server.crt').toString()
};

var app = express();

app.configure(function() {
	app.engine('dust', cons.dust);
	app.set('views', __dirname + '/views');
	app.set('view engine', 'dust');

	app.use(express.static(__dirname + '/public'));
	// app.use(express.logger());
	app.use(express.favicon(__dirname + '/public/img/favicon.ico'));

	app.use(express.cookieParser());
	app.use(express.session({ secret: 'that\'s a real secret' }));

	app.use(express.bodyParser());
	app.use(express.methodOverride());
	// Initialize Passport!  Also use passport.session() middleware, to support
	// persistent login sessions (recommended).
	app.use(app.router);
});

require('./lib/routes/home')(app);

https.createServer(credentials, app).listen(config.app.port);
winston.info('Listening on port '+ config.app.port);