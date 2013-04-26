var rand = require('../lib/cryptoRandom');
var should = require('chai').should();

describe('Test the generation of Crypto random strings', function() {

	var code;

	it('test the generation of a code', function () {
		var len = 10;
		var code = rand.generateCryptoUid(len);
		code.should.have.length(len*2);
	});

	it('test the generation of a different code', function () {
		var len = 10;
		var code1 = rand.generateCryptoUid(len);
		code1.should.have.length(len*2);
		code1.should.not.equal(code);
	});

	it('test the generation of a void code (length 0) should be in the default generation', function () {
		var len = 0;
		var c = rand.generateCryptoUid(len);
		c.should.have.length(8);
	});

	it('test the generation of a default length code (length 4)', function () {
		var c = rand.generateCryptoUid();
		c.should.have.length(8);
	});
});

