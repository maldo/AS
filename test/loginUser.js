var should = require('chai').should();
var superagent = require('superagent');
var util = require('util');
var route = require('./route');
var co = require('./const');

var agent;

describe('Login \'Username:Password\' test:', function () {
	before(function (done) {
		agent = superagent.agent();
		done();
	});

	describe('GET /', function () {
		it('is the root webpage', function (done) {
			agent
				.get(route.server)
				.end(function (req, res) {
					res.should.have.property('statusCode').that.equals(200);
					done();
				});
		});
	});

	describe('GET /login', function () {
		it('is the login webpage', function (done) {
			agent
				.get(route.login)
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
				.post(route.login)
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

		it('should go to the root page after triyng to access the /home when no log in', function (done){
			agent
				.get(route.home)
				.end(function (req, res) {
					//console.log(util.inspect(res));
					res.should.have.deep.property('redirects[0]').that.contain(route.server);
					res.should.have.property('text').that.not.contain(co.EMAIL);
					done();
				});
		});
	});

	describe('POST with a valid login', function () {

		it('logins into the AM with a valid login', function (done) {
			agent
				.post(route.login)
				.send({email : co.EMAIL})
				.send({password : co.PASSWORD})
				.end(function (req, res) {
					//console.log(util.inspect(res));
					res.should.have.property('statusCode').that.equals(200);
					res.should.have.deep.property('redirects[0]').that.contain(route.home);
					res.should.have.property('text').that.contain(co.EMAIL);
					res.should.have.property('text').that.contain('Log out');
					done();
				});
		});

		it('stays inside a session after a login', function (done) {
			agent
				.get(route.home)
				.end(function (req, res) {
					//console.log(util.inspect(res));
					res.should.have.property('text').that.contain(co.EMAIL);
					res.should.have.property('redirects').that.is.empty;
					done();
				});
		});

		it('stays inside a session after a login', function (done) {
			agent
				.get(route.login)
				.end(function (req, res) {
					//console.log(util.inspect(res));
					res.should.have.property('text').that.contain(co.EMAIL);
					res.should.have.deep.property('redirects[0]').that.contain(route.home);
					done();
				});
		});

		it('logs out', function (done) {
			agent
				.post(route.logout)
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

	describe('Trying to access the main page', function () {
		it('should deny access to the user page after log out', function (done) {
			agent
				.get(route.home)
				.end(function (req, res) {
					//console.log(util.inspect(res));
					res.should.have.property('statusCode').that.equals(200);
					res.should.have.property('text').that.not.contain(co.EMAIL);
					done();
				});
		});
	});
});