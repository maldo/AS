var config = require('../config/config');

//https://hostname.safelayer.lan:9980/
module.exports.server = config.app.server;

module.exports.loginPost = 'login';
module.exports.userPage = 'home';
module.exports.logoutPost = 'logout';
module.exports.AMconfig = '.well-known/uma-configuration';