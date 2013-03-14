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
		it('gets the AS endpoints configuration', function (done) {
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

		it('logins into the AM', function (done) {
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

		it('checks the registered resources and default policy \'All\'', function (done) {	
			agent
				.get(route.server+route.userPage)
				.end(function (req, res) {
					//console.log(util.inspect(res));
					res.should.have.property('statusCode').that.equals(200);
					res['redirects'][0].should.have.string(route.server+route.userPage);
					res.should.have.property('text');
					res['text'].should.contain('example1@mail.com');
					res['text'].should.contain('Log out');
					res['text'].should.contain('testingEjemploMocha'+co.rid);
					res['text'].should.contain('Resource Name');
					res['text'].should.contain('All');
					done();
				});
		});

		it('changes policy to \'+18\'', function (done) {	
			
			false.should.be.true;
			done();
			/*agent
				.post('https://localhost:8443/AM/wicket/page?4-1.IBehaviorListener.0-radioform-apply')
				.send('policy=2')
				.send('apply=1')
				.end(function (req, res) {
					console.log(util.inspect(res));
					done();
				});*/
		});

		it('checks the policy change from \'All\' to \'+18\'', function (done) {	
			agent
				.get(route.server+route.userPage)
				.end(function (req, res) {
					//console.log(util.inspect(res));
					res.should.have.property('statusCode').that.equals(200);
					res['redirects'][0].should.have.string(route.server+route.userPage);
					res.should.have.property('text');
					res['text'].should.contain('example1@mail.com');
					res['text'].should.contain('Log out');
					res['text'].should.contain('testingEjemploMocha'+co.rid);
					res['text'].should.contain('Resource Name');
					res['text'].should.contain('+18');
					done();
				});
		});

		//https://localhost:8443/AM/wicket/page?3-1.IBehaviorListener.0-radioform-apply

		it('checks the visits from one element', function (done) {	
			false.should.be.true;
			done();

			/*agent
				.get('')
				.end(function (req, res) {
					//console.log(util.inspect(res.text));
					false.should.be.true;
					done();
				});*/
		});
	});
});