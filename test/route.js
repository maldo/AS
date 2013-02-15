var config = require('../config/config');

//https://hostname.safelayer.lan:9980/
module.exports.server = config.app.server;

module.exports.loginPost = 'login';
module.exports.userPage = 'home';
module.exports.logoutPost = 'logout';
module.exports.loginGoogle = '0-1.ILinkListener-form-googlelink';
module.exports.loginGoogleLink = 'https://accounts.google.com/o/oauth2/auth?client_id=971575227873.apps.googleusercontent.com&redirect_uri=https://localhost:8443/AM/oauth/google&response_type=code&scope=https://www.googleapis.com/auth/userinfo.profile+https://www.googleapis.com/auth/userinfo.email&state=loginam';

module.exports.AMconfig = '.well-known/uma-configuration';

