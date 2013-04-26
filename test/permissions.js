var should = require('chai').should();
var util = require('util');
var route = require('./route');
var superagent = require('superagent');
var log = require('../lib/log.js');
var co = require('./const');

var agent;

describe('Test the Registration and Requests of Permission', function(){

	before(function (done) {
		agent = superagent.agent();
		done();
	});

	//RPT permisos insuficientes
	// mirar la edad de los example1 y google comprobar edad
	//example3 sin edad 
	//y mails con la lista de mails

	it('register a permission and gets a ticket', function (done) {
		agent
			.post(route.server + '/uma/preg/host/scope_reg_uri/'+co.CLIENT_ID)
			.set('Content-Type', 'application/json')
			.set('Authorization', 'Bearer ' + co.ACCESSTOKEN)
			.send({resource_set_id: co.rid})
			.send({scopes: ["https://localhost:8453/scopes/view"]})
			.end(function (req,res) {

				//log.debug('res')(res.body);
				res.should.have.property('statusCode').that.is.equal(201);
				should.exist(res.body);
				res.body.should.have.property('ticket').that.is.not.empty;
				co.TICKET = res.body.ticket;

				var location = route.server + '/uma/preg/host/scope_reg_uri/'+co.CLIENT_ID+'/'+co.rid;

				res.headers.should.have.property('location').that.is.equal(location);

				done();
			});
	});

	it('try to register a permission invalid accesstoken', function (done) {
		agent
			.post(route.server + '/uma/preg/host/scope_reg_uri/'+co.CLIENT_ID)
			.set('Content-Type', 'application/json')
			.set('Authorization', 'Bearer invalid')
			.send({resource_set_id: co.rid})
			.send({scopes: ["https://localhost:8453/scopes/view"]})
			.end(function (req,res) {

				//log.debug('res')(res.body);
				res.should.have.property('statusCode').that.equals(401);
				var error = 'Bearer realm=\"Users\", error=\"invalid_token\", error_description=\"Wrong access token\"';
				res.header['www-authenticate'].should.have.string(error);

				done();
			});
	});

	it('try to register a permission with no information', function (done) {
		agent
			.post(route.server + '/uma/preg/host/scope_reg_uri/'+co.CLIENT_ID)
			.set('Authorization', 'Bearer ' + co.ACCESSTOKEN)
			.end(function (req,res) {

				res.should.have.property('statusCode').that.equals(400);
				res.header['cache-control'].should.have.string("no-store");
				res.body.should.have.property('valid').that.is.false;
				done();
			});
	});

	/*====================================================================*/
	/*====================================================================*/
	/*====================================================================*/

	it('request a permission with valid rpt and ticket', function (done){
		agent
			.post(route.server + '/uma/preq')
			.set('Content-Type', 'application/json')
			.set('Authorization', 'Bearer ' + co.ACCESSTOKEN)
			.send({rpt: co.RPT})
			.send({ticket: co.TICKET})
			.end(function (req,res) {

				res.should.have.property('statusCode').that.equals(201);

				done();
			});
	});

	it('request a permission with valid rpt and invalid ticket', function (done){
		agent
			.post(route.server + '/uma/preq')
			.set('Content-Type', 'application/json')
			.set('Authorization', 'Bearer ' + co.ACCESSTOKEN)
			.send({rpt: co.RPT})
			.send({ticket: "invalid"})
			.end(function (req,res) {
				//log.debug('res')(res.body);

				res.should.have.property('statusCode').that.equals(400);
				res.should.have.deep.property('header.content-type').that.contain('application/json');
	
				res.body.status.should.be.equal('error');
				res.body.error.should.be.equal('invalid_requester_ticket');
				done();
			});
	});

	it ('request a permission with an invalid accesstoken', function (done) {
		agent
			.post(route.server + '/uma/preq')
			//.set('Content-Type', 'application/intro-resource-set+json')
			.set('Content-Type', 'application/json')
			.set('Authorization', 'Bearer invalid')
			.send({rpt: co.RPT})
			.send({ticket: co.TICKET})
			.end(function (req, res){

				res.should.have.property('statusCode').that.equals(401);
				var error = 'Bearer realm=\"Users\", error=\"invalid_token\", error_description=\"Wrong access token\"';
				res.header['www-authenticate'].should.have.string(error);
				done();
			});
	});

	it ('request a permission with no information', function (done) {
		
		var id = Math.round(Math.random() * 1000000);
		agent
			.post(route.server + '/uma/preq')
			.set('Authorization', 'Bearer ' + co.ACCESSTOKEN)
			.end(function (req, res){
				//console.log(res)
				res.should.have.property('statusCode').that.equals(400);
				res.header['cache-control'].should.have.string("no-store");
				res.body.should.have.property('valid').that.is.false;
				done();
			});
	});

});