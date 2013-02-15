var should = require('chai').should();
var util = require('util');
var route = require('./route');
var superagent = require('superagent');
var log = require('./log.js');
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

	it('registers a permission and gets a ticket', function (done) {

		//console.log(co.ACCESSTOKEN);

		agent
			.post('https://localhost:8443/AM/uma/preg/host/scope_reg_uri/Juma+Host')
			.set('Content-Type', 'application/json')
			.set('Authorization', 'Bearer ' + co.ACCESSTOKEN)
			.send({resource_set_id: co.rid})
			.send({scopes: ["https://localhost:8453/scopes/view"]})
			.end(function (req,res) {

				//log.debug('res')(res.body);

				should.exist(res.text);
				var resson = JSON.parse(res.text);
				resson.should.have.property('ticket').that.is.not.empty;
				co.TICKET = resson.ticket;

				done();
			});
	});

	it('requests a permission with valid rpt and ticket', function (done){
		agent
			.post('https://localhost:8443/AM/uma/preq')
			.set('Content-Type', 'application/json')
			.set('Authorization', 'Bearer ' + co.ACCESSTOKEN)
			.send({rpt: co.RPT})
			.send({ticket: co.TICKET})
			.end(function (req,res) {

				res.should.have.property('statusCode').that.equals(201);

				done();
			});
	})

	it('requests a permission with valid rpt and invalid ticket', function (done){
		agent
			.post('https://localhost:8443/AM/uma/preq')
			.set('Content-Type', 'application/json')
			.set('Authorization', 'Bearer ' + co.ACCESSTOKEN)
			.send({rpt: co.RPT})
			.send({ticket: "invalid"})
			.end(function (req,res) {
				//log.debug('res')(res.body);

				res.should.have.property('statusCode').that.equals(400);
				res.should.have.deep.property('header.content-type').that.contain('application/uma-status+json');

				var resData='';
				res.on('data', function(chunk) {
					resData += chunk;
				});

				res.on('end', function() {
					
					var resp = JSON.parse(resData);
					//log.debug('response')(resp);
					resp.status.should.be.equal('error');
					resp.error.should.be.equal('invalid_requester_ticket');
					done();
				});
			});
	})

});