var express = require('express');
var fs = require('fs');
var https = require('https');
var config = require('./lib/config/config');
var dust = require('dustjs-linkedin');
var cons = require('consolidate');
var path = require('path');
var winston = require('winston');
var passport = require('passport');
var RedisStore = require('connect-redis')(express);
var mongoose = require('mongoose');

/* Load credentials for https session */
var credentials = {
    key: fs.readFileSync( __dirname +'/lib/cert/keys/server.key').toString(),
    cert: fs.readFileSync( __dirname +'/lib/cert/certs/server.crt').toString()
};

/* Initialize Winston Logger */
var logger = module.exports = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)({
      colorize: true
    })
  ],
  levels: config.winston.levels,
  colors: config.winston.colors
});

/* MongoDB connection */
mongoose.connect(config.db.uri, function(err) {
	if (err) return logger.error('Problem connecting with MongoDB on '+ config.db.uri+'\nError: '+err);
	logger.info('MongoDB connected on '+ config.db.uri);
});

var app = express();

app.configure(function() {
	app.engine('dust', cons.dust);
	app.set('views', __dirname + '/views');
	app.set('view engine', 'dust');

	app.use(express.static(__dirname + '/public'));
	app.use(express.favicon(__dirname + '/public/img/favicon.ico'));

	app.use(express.cookieParser());
	//app.use(express.cookieSession({ secret: 'that\'s a real secret' }));
	app.use(express.session({
			store: new RedisStore({
				host: config.redis.host,
				port: config.redis.port
			}),
		secret: 'that\'s a real secret' 
	}));

	app.use(express.bodyParser());
	app.use(express.methodOverride());
	// Initialize Passport!  Also use passport.session() middleware, to support
	// persistent login sessions (recommended).
	app.use(passport.initialize());
	app.use(passport.session());
	app.use(app.router);
});

var RouteDir = './lib/routes';
var files = fs.readdirSync(RouteDir);

files.forEach(function (file) {
	var filePath = path.resolve('./', RouteDir, file);
	logger.verbose(filePath);
	require(filePath)(app);
});

/* Https server creation*/
https.createServer(credentials, app).listen(config.app.port);
logger.info('Version '+ require('./package').version);
logger.info('Running on server '+ config.app.host);
logger.info('Listening on port '+ config.app.port);
logger.info('This a is update branch test');
