var should = require('chai').should();
var util = require('util');
var route = require('./route');
var superagent = require('superagent');
var log = require('../lib/log.js');
var co = require('./const');

var agent;
var tid;

describe('Testing Oauth', function () {

	before(function (done) {
		agent = superagent.agent();
		require('./clientServer.es');
		done();
	});

	describe('Testing AS server Oauth', function () {

		it('get the Oauth web page login of the AS server', function (done) {
			agent
				.get(co.SERVER+'/oauth/AS')
				.end(function (req, res) {
					//console.log(util.inspect(res));
					res.should.have.property('statusCode').that.equals(200);
					res.should.have.property('text').that.have.string(co.CLIENT_ID);
					should.exist(res['redirects']);
					done();
				});
		});

		it('get the Oauth Allow/Deny web page of the AS server', function (done) {
			agent
				.post(route.login)
				.send({email : co.EMAIL})
				.send({password : co.PASSWORD})
				.end(function (req, res) {
					//console.log(util.inspect(res.text));

					var iniToken = res.text.indexOf('transaction_id');
	 				var algo = res.text.slice(iniToken, iniToken+46);
	 				tid = algo.slice(-9,-1);

					res.should.have.property('statusCode').that.equals(200);
					should.exist(res['redirects']);
					res['text'].should.have.string('Allow');
					res['text'].should.have.string('Deny');
					res['text'].should.have.string('Log out');
					done();
				});
		});

		it('deny the access to the AS server and redirects you out', function (done){
			agent
				.post(route.decision)
				.send({transaction_id : tid})
				.send({cancel : "Deny"})
				.end(function (req, res){
					//log.debug('Response')(res);
					should.exist(res['text']);
					res.text.should.have.equal('You have denied access to the AS');
					should.exist(res['redirects']);
					res.redirects[res.redirects.length-1].should.include('/fail');
					done();
				});
		});

		it ('ask for the Oauth token PAT/AAT after denied access (shouldn\'t exist)', function () {
			//console.log(ACCESSTOKEN);
			should.not.exist(co.ACCESSTOKEN);
		});

		it('get the Oauth web page login of the AS server', function (done) {
			agent
				.get(co.SERVER+'/oauth/AS')
				.end(function (req, res) {
					//console.log(util.inspect(res));
					res.should.have.property('statusCode').that.equals(200);
					res.should.have.property('text').that.have.string(co.CLIENT_ID);
					should.exist(res['redirects']);
					done();
				});
		});

		it('get the Oauth Allow/Deny web page of the AS server', function (done) {
			agent
				.post(route.login)
				.send({email : co.EMAIL})
				.send({password : co.PASSWORD})
				.end(function (req, res) {
					//console.log(util.inspect(res.text));

					var iniToken = res.text.indexOf('transaction_id');
	 				var algo = res.text.slice(iniToken, iniToken+46);
	 				tid = algo.slice(-9,-1);

					res.should.have.property('statusCode').that.equals(200);
					should.exist(res['redirects']);
					res['text'].should.have.string('Allow');
					res['text'].should.have.string('Deny');
					res['text'].should.have.string('Log out');
					done();
				});
		});

		it('allow the access throw Oauth & gets the code', function (done){
			agent
				.post(route.decision)
				.send({transaction_id : tid})
				.end(function (req, res){
					//log.debug('Response')(res);
					should.exist(res['text']);
					var resp = JSON.parse(res.text);
					//log.error('the code')(resp.code);
					should.exist(resp.code);
					done();
				});
		});
		// NOTE No podemos validar con diferentes codes, 
		// dado que el testing no se encarga de generar las peticiones con el code
		// codes invalidos y mismo code


		it ('check the Oauth token PAT/AAT', function (){
			//console.log(co.ACCESSTOKEN);
			should.exist(co.ACCESSTOKEN);
		});
	});

	describe('RPT Token', function () {

		it ('get the RPT ticket with an AAT', function (done){
			agent 
				.post(route.server+'/uma/rpt')
				.set('Authorization', 'Bearer '+ co.ACCESSTOKEN)
				.end(function (req, res){
					//log.debug('Response')(res);
					res.header['content-type'].should.contain('application/json');
					res.should.have.property('statusCode').that.equals(201);
					should.exist(res.text);
					var resson = JSON.parse(res.text);
					co.RPT = resson.rpt;
					//console.log(util.inspect(resson));
					should.exist(resson.rpt)
					done();
				});
		});

		it ('fail to get the RPT ticket, invalid accessToken', function (done){
			agent
				.post(route.server+'/uma/rpt')
				.set('Authorization', 'Bearer invalid')
				.end(function (req, res){
					//log.debug('Response')(res);
					res.should.have.property('statusCode').that.equals(401);
					var error = 'UMA realm=\"AS\",error=\"invalid_token\",error_description=\"Wrong access token\"';
					res.header['www-authenticate'].should.have.string(error);
					done();
				});
		});

		it ('check the status of a RPT', function (done){
			agent
				.post(route.server+'/uma/rptstat')
				.set('Content-Type', 'application/json')
				.set('Authorization', 'Bearer ' + co.ACCESSTOKEN)
				.send({rpt:co.RPT})
				.end(function (req, res) {
					//log.debug('response')(res);

					should.exist(res.text);
					var resson = JSON.parse(res.text);
					//log.debug('response')(resson);

					resson.should.have.property('issued_at');
					resson.should.have.property('expires_at');
					resson.should.have.property('permissions');
					resson.should.have.property('valid').that.is.true;
					
					done();
				});
		});

		it ('check the status of a RPT with an invalid accessToken', function (done){
			agent
				.post(route.server+'/uma/rptstat')
				.set('Content-Type', 'application/json')
				.set('Authorization', 'Bearer invalid')
				.send({rpt:co.RPT})
				.end(function (req, res) {
					//log.debug('response')(res.headers);

					res.should.have.property('statusCode').that.equals(401);
					var error = 'Bearer realm=\"Users\", error=\"invalid_token\", error_description=\"Wrong access token\"';
					res.header['www-authenticate'].should.have.string(error);
					done();
				});
		});

		it ('check the status of an invalid RPT', function (done){
			agent
				.post(route.server+'/uma/rptstat')
				.set('Content-Type', 'application/json')
				.set('Authorization', 'Bearer ' + co.ACCESSTOKEN)
				.send({rpt:"this is an invalid RPT"})
				.end(function (req, res) {
					//log.debug('response')(res.header);

					res.header['cache-control'].should.have.string('no-store');
					should.exist(res.text);
					var resson = JSON.parse(res.text);
					//log.debug('response')(resson);

					resson.should.have.property('valid').that.is.false;
					
					done();
				});
		});

		it ('check the status of an RPT without RPT', function (done){
			agent
				.post(route.server+'/uma/rptstat')
				//.set('Content-Type', 'application/json')
				.set('Authorization', 'Bearer ' + co.ACCESSTOKEN)
				.end(function (req, res) {
					//log.debug('response')(res.header);
					res.header['cache-control'].should.have.string('no-store');

					should.exist(res.text);
					var resson = JSON.parse(res.text);
					//log.debug('response')(resson);

					resson.should.have.property('valid').that.is.false;
					
					done();
				});
		});
	});
});

describe('Register a Resource', function (){

	before(function (done) {
		agent = superagent.agent();
		done();
	});

	it ('register a resource in to the AS', function (done) {
		
		co.rid = Math.round(Math.random() * 1000000).toString();
		agent
			.put(route.server+'/uma/rsreg/resource_set/'+co.rid)
			//.set('Content-Type', 'application/intro-resource-set+json')
			.set('Content-Type', 'application/json')
			.set('Authorization', 'Bearer ' + co.ACCESSTOKEN)
			.send({name:"testingEjemploMocha"+co.rid+".jpg"})
			.send({icon_uri:"http://localhost:8080/icons/album.png"})
			.send({scopes:["http://localhost:8080/scopes/view"]})
			.end(function (req, res){

				var resData='';
				res.on('data', function(chunk) {
					resData += chunk;
				});

				res.on('end', function() {
					
					var headerAnswer = 'application/intro-status+json';
					res.header.should.have.property('content-type').that.contain(headerAnswer);
					res.statusCode.should.be.equal(201);
					var resp = JSON.parse(resData);
					//log.debug('response')(resp);
					resp.status.should.be.equal('created');
					resp._id.should.be.equal(co.rid);
					should.exist(resp._rev);
					done();
				});
			});
	});

	it ('register a resource2 in to the AS', function (done) {
		
		co.rid = Math.round(Math.random() * 1000000).toString();
		agent
			.put(route.server+'/uma/rsreg/resource_set/'+co.rid)
			//.set('Content-Type', 'application/intro-resource-set+json')
			.set('Content-Type', 'application/json')
			.set('Authorization', 'Bearer ' + co.ACCESSTOKEN)
			.send({name:"testingEjemploMocha"+co.rid+".jpg"})
			.send({icon_uri:"http://localhost:8080/icons/album.png"})
			.send({scopes:["http://localhost:8080/scopes/view"]})
			.end(function (req, res){

				var resData='';
				res.on('data', function(chunk) {
					resData += chunk;
				});

				res.on('end', function() {
					
					var headerAnswer = 'application/intro-status+json';
					res.header.should.have.property('content-type').that.contain(headerAnswer);
					res.statusCode.should.be.equal(201);
					var resp = JSON.parse(resData);
					//log.debug('response')(resp);
					resp.status.should.be.equal('created');
					resp._id.should.be.equal(co.rid);
					should.exist(resp._rev);
					done();
				});
			});
	});

	it ('register a resource3 in to the AS', function (done) {
		
		co.rid = Math.round(Math.random() * 1000000).toString();
		agent
			.put(route.server+'/uma/rsreg/resource_set/'+co.rid)
			//.set('Content-Type', 'application/intro-resource-set+json')
			.set('Content-Type', 'application/json')
			.set('Authorization', 'Bearer ' + co.ACCESSTOKEN)
			.send({name:"testingEjemploMocha"+co.rid+".jpg"})
			.send({icon_uri:"http://localhost:8080/icons/album.png"})
			.send({scopes:["http://localhost:8080/scopes/view"]})
			.end(function (req, res){

				var resData='';
				res.on('data', function(chunk) {
					resData += chunk;
				});

				res.on('end', function() {
					
					var headerAnswer = 'application/intro-status+json';
					res.header.should.have.property('content-type').that.contain(headerAnswer);
					res.statusCode.should.be.equal(201);
					var resp = JSON.parse(resData);
					//log.debug('response')(resp);
					resp.status.should.be.equal('created');
					resp._id.should.be.equal(co.rid);
					should.exist(resp._rev);
					done();
				});
			});
	});

	it ('try to register a resource in to the AS providing an invalid accesstoken', function (done) {
		
		var id = Math.round(Math.random() * 1000000);
		agent
			.put(route.server+'/uma/rsreg/resource_set/'+id)
			//.set('Content-Type', 'application/intro-resource-set+json')
			.set('Content-Type', 'application/json')
			.set('Authorization', 'Bearer invalid')
			.send({name:"testingEjemploMocha"+id+".jpg"})
			.send({icon_uri:"http://localhost:8080/icons/album.png"})
			.send({scopes:["http://localhost:8080/scopes/view"]})
			.end(function (req, res){

				res.should.have.property('statusCode').that.equals(401);
				var error = 'Bearer realm=\"Users\", error=\"invalid_token\", error_description=\"Wrong access token\"';
				res.header['www-authenticate'].should.have.string(error);
				done();
			});
	});

	it ('try to register a resource in to the AS with no information', function (done) {
		
		var id = Math.round(Math.random() * 1000000);
		agent
			.put(route.server+'/uma/rsreg/resource_set/'+id)
			//.set('Content-Type', 'application/intro-resource-set+json')
			//.set('Content-Type', 'application/json')
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