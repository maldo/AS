var should = require('chai').should();
var superagent = require('superagent');
var util = require('util');
var route = require('./route');
var co = require('./const');

var agent;

describe('Testing registered Resources', function () {
	before(function (done) {
		agent = superagent.agent();
		done();
	});

	describe('GET the AS configuration', function () {
		it('get the AS endpoints configuration', function (done) {
			agent
				.get(route.ASconfig)
				.end(function (req, res) {
					var resData='';
					res.on('data', function(chunk) {
						resData += chunk;
					});

					res.on('end', function() {
						var endpoints = JSON.parse(resData);
						//console.log(util.inspect(endpoints));
						endpoints.should.have.deep.property("user_endpoint", "https://sasimi.safelayer.lan:9980/oauth/grant");
						endpoints.should.have.deep.property("introspection_endpoint", "https://sasimi.safelayer.lan:9980/uma/rptstat");
						endpoints.should.have.deep.property("token_endpoint", "https://sasimi.safelayer.lan:9980oauth/token");
						endpoints.should.have.property("pat_grant_types_supported").include("authorization_code");
						endpoints.should.have.deep.property("resource_set_registration_endpoint", "https://sasimi.safelayer.lan:9980uma/rsreg");
						endpoints.should.have.deep.property("pat_profiles_supported").include("bearer");
					});					

					res.should.have.property('statusCode').that.equals(200);
					
					done();
				});
		});
	});

	describe('Resource list', function () {

		it('is the root webpage', function (done) {
			agent
				.get(route.server)
				.end(function (req, res) {
					res.should.have.property('statusCode').that.equals(200);
					done();
				});
		});

		it('login into the AS', function (done) {
			agent 
				.post(route.login)
				.send({email : co.EMAIL})
				.send({password : co.PASSWORD})
				.end(function (req, res) {
					//console.log(util.inspect(res));
					res.should.have.property('statusCode').that.equals(200);
					res['redirects'][0].should.have.string(route.home);
					res['text'].should.contain(co.EMAIL);
					res['text'].should.contain('Log out');
					done();
				});
		});

		it('check the registered resources and default policy \'All\'', function (done) {	
			agent
				.get(route.home+'/'+co.CLIENT)
				.end(function (req, res) {
					//console.log(util.inspect(res));
					//console.log(route.home+'/'+co.CLIENT)
					res.should.have.property('statusCode').that.equals(200);
					res.should.have.property('text');
					res['text'].should.contain(co.EMAIL);
					res['text'].should.contain('Log out');
					res['text'].should.contain('testingEjemploMocha'+co.rid);
					res['text'].should.contain('Resource');
					res['text'].should.contain('All');
					done();
				});
		});

		it('change policy to \'+18\'', function (done) {
			
			agent
				.post(route.home+'/'+co.CLIENT+'/'+co.rid)
				.send({privacy : "+18"})
				.end(function (req, res) {
					//console.log(util.inspect(res));
					//console.log(route.home+'/'+co.CLIENT+'/'+co.rid)
					res.should.have.property('statusCode').that.equals(200);
					res.should.have.property('text');
					res['text'].should.contain(co.EMAIL);
					res['text'].should.contain('Log out');
					res['text'].should.contain('testingEjemploMocha'+co.rid);
					res['text'].should.contain('Resource');
					res['text'].should.contain('+18');
					done();
				});
		});

		it('check the policy change from \'+18\' to \'Selected Emails\'', function (done) {	
			agent
				.post(route.home+'/'+co.CLIENT+'/'+co.rid)
				.send({privacy : "Selected emails"})
				.send({emails : "aaaa@bbbb.com"})
				.end(function (req, res) {
					//console.log(util.inspect(res));
					res.should.have.property('statusCode').that.equals(200);
					res.should.have.property('text');
					res['text'].should.contain('aaaa@bbbb.com');
					res['text'].should.contain('Log out');
					res['text'].should.contain('testingEjemploMocha'+co.rid);
					res['text'].should.contain('Resource');
					res['text'].should.contain('Selected emails');
					done();
				});
		});

		it('check the policy change from \'Selected Emails\' to \'All\'', function (done) {	
			agent
				.post(route.home+'/'+co.CLIENT+'/'+co.rid)
				.send({privacy : "All"})
				.end(function (req, res) {
					//console.log(util.inspect(res));
					res.should.have.property('statusCode').that.equals(200);
					res.should.have.property('text');
					res['text'].should.contain('Log out');
					res['text'].should.contain('testingEjemploMocha'+co.rid);
					res['text'].should.contain('Resource');
					res['text'].should.contain('All');
					done();
				});
		});

		it('check the visits from one element', function (done) {	
			agent
				.get(route.home+'/'+co.CLIENT)
				.end(function (req, res) {
					//console.log(util.inspect(res));
					//console.log(route.home+'/'+co.CLIENT)
					res.should.have.property('statusCode').that.equals(200);
					res.should.have.property('text');
					res['text'].should.contain(co.EMAIL);
					res['text'].should.contain('Log out');
					res['text'].should.contain('testingEjemploMocha'+co.rid);
					res['text'].should.contain('Resource');
					res['text'].should.contain('Visits');
					done();
				});
		});
	});
});