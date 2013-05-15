var config = {}

config.db = {};
config.redis = {};
config.app = {};
config.github = {};
config.winston = {};
config.security = {};


/************************************************************************/
/*							DataBase Configuration						*/
config.db.host = '192.168.5.101';
config.db.port = 27017;
config.db.database = 'as';
config.db.user = 'root';
config.db.password = '123456';
config.db.uri = 'mongodb://'+config.db.host+':'+config.db.port+'/'+config.db.database;


/************************************************************************/
/*							Redis Configuration							*/
config.redis.host = '192.168.5.100';
config.redis.port = 6379;
config.redis.ttl = 3600;
config.redis.ttlCode = 120;
config.redis.TOKEN = 1;
config.redis.CODE = 2;
config.redis.RPT = 3;
config.redis.TICKET = 4;


/************************************************************************/
/*							Application Configuration					*/
config.app.cluster = true;
config.app.port = process.env.PORT || 9980;
config.app.host = require('os').hostname()+'.safelayer.lan';
config.app.protocol = 'http';
config.app.server = config.app.protocol +'://'+config.app.host+':'+config.app.port;


/************************************************************************/
/*							Security Configuration						*/
config.security.passwordHash = 'sha256';
config.security.userUidLength = 16;
config.security.tokenLength = 32;
config.security.codeLength = 8;


/************************************************************************/
/*							Github Configuration						*/
config.github.client_id = "07108f2c340bbb614344";
config.github.client_secret = "5692398efed9337bbb437a94e1601f6497199d81";
config.github.callback_url = 'https://'+config.app.host+':'+config.app.port+'/auth/github/callback';


/************************************************************************/
/*							Winston Logger Configuration				*/
config.winston.levels = {
		silly: 0,
		verbose: 1,
		info: 2,
		data: 3,
		warn: 4,
		debug: 5,
		error: 6
	};

config.winston.colors = {
		silly: 'magenta',
		verbose: 'cyan',
		info: 'green',
		data: 'grey',
		warn: 'yellow',
		debug: 'blue',
		error: 'red'
};

module.exports = config;
