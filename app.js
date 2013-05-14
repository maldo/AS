var config = require('./lib/config/config');
var server = require('./server');

if (config.app.cluster) {

	require('./clustermanager').childSpawn(require('os').cpus().length,
		function (id) {
			server.create();
		});

} else {
	server.create();
}
