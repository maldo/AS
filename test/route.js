var config = require('../config/config');

//https://hostname.safelayer.lan:9980/
module.exports.server = config.app.server;

module.exports.login = this.server +'/login';
module.exports.home = this.server + '/home';
module.exports.logout = this.server +'/logout';
module.exports.signup = this.server + '/signup';
module.exports.ASconfig = this.server+'/.well-known/uma-configuration';
module.exports.clientSignup = this.server + '/client/signup';
module.exports.clientLogin = this.server + '/client/login';
module.exports.clientLogout = this.server + '/client/logout';
module.exports.client = this.server + '/client';