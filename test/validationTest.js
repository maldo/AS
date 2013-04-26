var should = require('chai').should();
var validate = require('../lib/validatorFields');

describe('Test the Validation functions', function() {

	it('test the email validation', function () {
		validate.email('This is not an email').should.be.false
		validate.email('a@a').should.be.false
		validate.email('a.com').should.be.false
		validate.email('@a.com').should.be.false
		validate.email('@.').should.be.false
		validate.email('@com').should.be.false
		validate.email('example@.com').should.be.false
		validate.email('example#server.com').should.be.false

		validate.email('example@server.com').should.be.true
		validate.email('example@server.net').should.be.true
		validate.email('example@server.ly').should.be.true
		validate.email('example@server.co.uk').should.be.true
	});

	it('test the name validation', function () {
		validate.name('').should.be.false
		validate.name('a').should.be.false
		validate.name('ab').should.be.false
		validate.name('abc').should.be.false
		validate.name('abcd').should.be.false
		validate.name('abcde').should.be.false

		validate.name('abcdef').should.be.true
		validate.name('abcdefg').should.be.true
		validate.name('abcdefgh').should.be.true
	})

	it('test the password validation', function () {
		validate.password('').should.be.false

		validate.password('12345678').should.be.false
		validate.password('abcdefgh').should.be.false
		validate.password('ABCDEFGH').should.be.false
		validate.password('@@@###&&').should.be.false

		validate.password('1aA@').should.be.false
		validate.password('12345A%').should.be.false
		validate.password('12345a%').should.be.false

		validate.password('12345Aa%').should.be.true
		validate.password('!aAc&gt<23#').should.be.true
		validate.password('@aA12345').should.be.true
	})

	it('test the URL validation', function () {
		validate.url('').should.be.false
		validate.url('://www.safelayer.com').should.be.false
		validate.url('ww.safelayer.com').should.be.false
		validate.url('http@safelayer.com').should.be.false
		validate.url('wvw.safelayer.com').should.be.false
		validate.url('http//:wwwsafelayer.com').should.be.false
		validate.url('http//:www.safelayer.com').should.be.false
		validate.url('https//:www.safelayer.co.uk').should.be.false
		validate.url('http//www.safelayer.com').should.be.false
		validate.url('httpwww.safelayer.com').should.be.false
		validate.url('http.www.safelayer.com').should.be.false
		validate.url('http//:.www.safelayer.com').should.be.false
		validate.url('https//www.safelayer.com#sth/page').should.be.false
		validate.url('https//www.safelayer.com//sth/page').should.be.false
		//validate.url('https://www.safelayer.com////sth/page').should.be.false
		//validate.url('https:///www.safelayer.com/sth/page').should.be.false


		validate.url('http://www.safelayer.com').should.be.true
		validate.url('https://www.safelayer.com').should.be.true
		//validate.url('www.safelayer.com').should.be.true
		//validate.url('safelayer.com').should.be.true
		validate.url('http://safelayer.com').should.be.true
		validate.url('https://safelayer.com/page/').should.be.true
		validate.url('https://safelayer.com/page/another').should.be.true
		validate.url('https://safelayer.com/page/another:3000').should.be.true
	})

	it('test the Year validation', function () {
		validate.year('').should.be.false
		validate.year('1000').should.be.false
		validate.year('3000').should.be.false
		validate.year('1899').should.be.false
		validate.year('2100').should.be.false
		validate.year('0').should.be.false

		validate.year('2013').should.be.true
		validate.year('1900').should.be.true
		validate.year('2099').should.be.true
		validate.year('1992').should.be.true
	})

	it('test the Month validation', function () {
		validate.month('').should.be.false
		validate.month('13').should.be.false
		validate.month('100').should.be.false
		validate.month('0').should.be.false

		validate.month('1').should.be.true
		validate.month('9').should.be.true
		validate.month('10').should.be.true
		validate.month('12').should.be.true
	})

	it('test the Day validation', function () {
		validate.day('').should.be.false
		validate.day('32').should.be.false
		validate.day('40').should.be.false
		validate.day('100').should.be.false
		validate.day('0').should.be.false

		validate.day('1').should.be.true
		validate.day('9').should.be.true
		validate.day('10').should.be.true
		validate.day('20').should.be.true
		validate.day('29').should.be.true
		validate.day('30').should.be.true
		validate.day('31').should.be.true
	})

});