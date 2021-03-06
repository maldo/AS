var should = require('chai').should();
var superagent = require('superagent');
var util = require('util');
var route = require('./route');
var co = require('./const');

var agent;

describe('Login \'Client:Password\' test:', function () {
	before(function (done) {
		agent = superagent.agent();
		done();
	});

	describe('GET /client/login', function () {
		it('is the client webpage', function (done) {
			agent
				.get(route.clientLogin)
				.end(function (req, res) {
					res.should.have.property('statusCode').that.equals(200);
					res.should.have.property('text').that.contain('Please Login');
					done();
				});
		});
	});

	describe('POST with no valid login', function () {

		it('should redirect into the root webpage after incorrect login', function (done) {
			agent
				.post(route.clientLogin)
				.send({email : co.EMAIL})
				.send({password : "wrongpassword"})
				.end(function (req, res) {
					//console.log(util.inspect(res));
					res.should.have.property('statusCode').that.equals(200);
					res.should.have.deep.property('redirects[0]').that.contain(route.server);
					res.should.have.property('text').that.contain('Create an Account');
					done();
				});
		});

		it('should go to the client login page after triyng to access the /client when no log in', function (done){
			agent
				.get(route.client)
				.end(function (req, res) {
					//console.log(util.inspect(res));
					res['redirects'][0].should.contain(route.clientLogin);
					res.should.have.property('text').that.not.contain(co.EMAIL);
					res.should.have.property('text').that.contain('Please Login');
					done();
				});
		});
	});

	describe('POST with a valid login', function () {

		it('login into the AM with a valid login', function (done) {
			agent
				.post(route.clientLogin)
				.send({email : co.EMAIL})
				.send({password : co.PASSWORD})
				.end(function (req, res) {
					//console.log(util.inspect(res.text));
					res.should.have.property('statusCode').that.equals(200);
					res.should.have.deep.property('redirects[0]').that.equals(route.client);
					res.should.have.property('text').that.contain(co.EMAIL);
					res.should.have.property('text').that.contain('Log out');
					res.should.have.property('text').that.contain('Client ID');
					res.should.have.property('text').that.contain('Client Secret');

					var initid = res.text.indexOf('Client ID');
					var span = res.text.indexOf('</span>', initid);
					var clid = res.text.slice((span-16),span);

					co.CLIENT_ID = clid;

					initid = res.text.indexOf('Client Secret');
					span = res.text.indexOf('</span>', initid);
					var clis = res.text.slice((span-32),span);

					co.CLIENT_SECRET = clis;

					done();
				});
		});

		it('stay inside a session after a login', function (done) {
			agent
				.get(route.client)
				.end(function (req, res) {
					//console.log(util.inspect(res));
					res.should.have.property('text').that.contain(co.EMAIL);
					res.should.have.property('redirects').that.is.empty;
					done();
				});
		});

		it('should redirect into the client webpage if logged', function (done) {
			agent
				.get(route.clientLogin)
				.end(function (req, res) {
					//console.log(util.inspect(res));
					res.should.have.property('statusCode').that.equals(200);
					res.should.have.deep.property('redirects[0]').that.contain(route.client);
					res.should.have.property('text').that.contain(co.CLIENT);
					done();
				});
		});

		it('log out', function (done) {
			agent
				.post(route.clientLogout)
				.send('')
				.end(function (req, res) {
					//console.log(util.inspect(res));
					res.should.have.property('statusCode').that.equals(200);
					res.should.have.property('text').that.not.contain(co.EMAIL);
					res.should.have.deep.property('redirects[0]').that.contain(route.server);
					done();
				});
		});
	});

	describe('Trying to access the client main page', function () {
		it('should deny access to the user page after log out', function (done) {
			agent
				.get(route.client)
				.end(function (req, res) {
					//console.log(util.inspect(res));
					res.should.have.property('statusCode').that.equals(200);
					res.should.have.property('text').that.not.contain(co.EMAIL);
					done();
				});
		});
	});
});