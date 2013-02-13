var log = require('../log');

module.exports = function(app) {

	app.all('/*', function (req, res, next) {
		log.error('------------------------------------------ from:')(req.ip);
		log.warn(req.method)(req.url);
		log.debug('headers')(req.headers);
		log.debug('query')(req.query);
		log.debug('body')(req.body);
		next();
	});
};