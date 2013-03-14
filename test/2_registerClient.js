var should = require('chai').should();
var superagent = require('superagent');
var util = require('util');
var route = require('./route');
var co = require('./const');
var mongoose = require('mongoose');
var config = require('../config/config');
var db = require('../lib/db');

var agent;

describe('Register a new Client test:', function () {
	before(function (done) {
		agent = superagent.agent();

		mongoose.connect(config.db.uri, function(err) {
			//console.log('MongoDB connected on '+ config.db.uri);
			db.Client.remove({}, function(err) {
    			//console.log('collection dropped');
    			done();
			});
		});
	});

	describe('GET /client/signup', function () {
		it('is the client signup webpage', function (done) {
			agent
				.get(route.clientSignup)
				.end(function (req, res) {
					//console.log(res);
					res.should.have.property('statusCode').that.equals(200);
					res.should.have.property('text').that.contain('Sign Up');
					res.should.have.property('text').that.contain('User Managed Access');
					done();
				});
		});
	});

	describe('Tries to register a new Client', function () {

		it('should not register a client with an invalid name', function (done) {
			agent
				.post(route.clientSignup)
				.send({name: ''})
				.send({email : co.EMAIL})
				.send({password : co.PASSWORD})
				.end(function (req, res) {
					//console.log(util.inspect(res));
					res.should.have.property('statusCode').that.equals(200);
					res.should.have.property('text').that.contain('Please provide a valid name');
					done();
				});
		});

		it('should not register a client with an invalid email', function (done) {
			agent
				.post(route.clientSignup)
				.send({name: co.NAME})
				.send({email : 'This is not an email'})
				.send({password : co.PASSWORD})
				.end(function (req, res) {
					//console.log(util.inspect(res));
					res.should.have.property('statusCode').that.equals(200);
					res.should.have.property('text').that.contain('Please provide a valid email');
					done();
				});
		});

		it('should not register a client with a weak password', function (done){
			agent
				.post(route.clientSignup)
				.send({name: co.NAME})
				.send({email : co.EMAIL})
				.send({password : 1})
				.end(function (req, res) {
					//console.log(util.inspect(res));
					res.should.have.property('statusCode').that.equals(200);
					res.should.have.property('text').that.contain('Please provide a strong password');
					done();
				});
		});
	});

	describe('Register a new Client', function () {

		it('registers a new Client into the AS', function (done) {
			agent
				.post(route.clientSignup)
				.send({name: co.CLIENT})
				.send({email : co.EMAIL})
				.send({password : co.PASSWORD})
				.end(function (req, res) {
					//console.log(util.inspect(res));
					res.should.have.property('statusCode').that.equals(200);
					res.should.have.deep.property('redirects[0]').that.contain(route.client);
					res.should.have.property('text').that.contain(co.EMAIL);
					done();
				});
		});

		it('fails to register a new user with a registered email', function (done) {
			agent
				.post(route.clientSignup)
				.send({name: co.CLIENT})
				.send({email : co.EMAIL})
				.send({password : co.PASSWORD})
				.end(function (req, res) {
					//console.log(util.inspect(res));
					res.should.have.property('statusCode').that.equals(200);
					res.should.have.property('text').that.contain('This email is already registered');
					done();
				});
		});
	});
});