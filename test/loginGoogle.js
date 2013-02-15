var should = require('chai').should();
var util = require('util');
var route = require('./route');
var Browser = require('zombie');
var log = require('./log.js');

var browser;
var path;

describe('Login \'Sign with Google\' test:', function () {
	
	it('loads the google login page', function (done) {
 		browser = new Browser();
 		//browser.runScripts = false;		
 		browser.on("error", function(error) {
 			console.error(error);
 		});
 		browser
 			.visit(route.server)
 			.then(function() {
 				var x = browser.saveCookies();
 				var iniSess = x.indexOf('JSESSION');
 				var finSess = x.indexOf(';');
 				var jsession = x.slice(iniSess,finSess);
 				path = route.server+';'+jsession+'?'+route.loginGoogle;
				
 				return browser.visit(path/*,{"debug" : true, "runScripts" : false}*/);
 			})
 			.then(function () {
 				browser.html().should.contain(':8443/AM/oauth/google');
 			})
 			.then(done, done);
	});

	it('logs in to google', function (done) {
 		browser
 			.visit(path/*,{"debug" : true, "runScripts" : false}*/)
 			.then(function() {
 				//console.log(browser.html());
 				browser.fill('Email','alice.flex.test');
 				browser.fill('Passwd','demodemo');
 				return browser.pressButton('signIn');
 			})
 			.then(function () {
 				browser.html().should.contain('Solicitud de permiso');
 				browser.text("title").should.have.string('Solicitud de permiso');
 			})
 			.then(done, done);
	});
});