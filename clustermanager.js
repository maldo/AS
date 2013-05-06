
var childSpawn = function (numCPUs, childProcess) {
	var cluster = require('cluster');

	if (cluster.isMaster) {
		// Fork workers.
		for (var i = 0; i < numCPUs; i++) {
			cluster.fork();
		}
		cluster.on('exit', function (worker, code, signal) {
								console.log('worker ' + worker.process.pid + ' died');
							});
	} else {
		childProcess(cluster.worker.id);
	}
};

exports.childSpawn = childSpawn;