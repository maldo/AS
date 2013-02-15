var config = require('../../config/endpoints');

module.exports = function (app) {

	app.get('/.well-known/uma-configuration', function (req, res) {

		res.json(config);

	});
};