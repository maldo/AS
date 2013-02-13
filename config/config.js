var config = {}

config.db = {};
config.redis = {};
config.app = {};
config.github = {};
config.winston = {};

config.redis.uri;
config.redis.host = 'hostname';
config.redis.port = 6379;

config.app.port = process.env.PORT || 9980;
config.app.host = require('os').hostname()+'.safelayer.lan';

config.github.client_id = "07108f2c340bbb614344";
config.github.client_secret = "5692398efed9337bbb437a94e1601f6497199d81";
config.github.callback_url = 'https://'+config.app.host+':'+config.app.port+'/auth/github/callback';


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