var should = require('chai').should();
var log = require('./log.js');
var validate = require('../lib/validatorFields');

describe('Test the Validation functions', function(){

	it('tests the email validation', function () {
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

	it('tests the name validation', function (){
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

	it('test the password validation', function (){
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
});