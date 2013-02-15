var util = require('util');
var _darkblack = '\033[30m';
var _darkred = '\033[31m';
var _darkgreen = '\033[32m';
var _darkyellow = '\033[33m';
var _darkblue = '\033[34m';
var _darkpink = '\033[35m';
var _darkcyan = '\033[36m';
var _darkwhite = '\033[37m';

var _lightblack = '\033[30;1m';
var _lightred = '\033[31;1m';
var _lightgreen = '\033[32;1m';
var _lightyellow = '\033[33;1m';
var _lightblue = '\033[34;1m';
var _lightpink = '\033[35;1m';
var _lightcyan = '\033[36;1m';
var _lightwhite = '\033[37;1m';

var _resetcolor = '\033[0m';

function lightblack(str) { return _lightblack + str + _resetcolor; }
function darkcyan(str) { return _darkcyan + str + _resetcolor; }
function lightcyan(str) { return _lightcyan + str + _resetcolor; }
function lightgreen(str) { return _lightgreen + str + _resetcolor; }
function lightyellow(str) { return _lightyellow + str + _resetcolor; }
function lightred(str) { return _lightred + str + _resetcolor; }

var tinit = +new Date();

function showLog(str) {
	return function(promise) {
		var tstr = lightblack(+new Date() -tinit);
		
		if(typeof arguments[0] === 'string') {
			var inspect = darkcyan(arguments[0]);
		} else {
			var inspect = util.inspect(arguments[0], true, 3, true);
		}
		console.log(tstr, str, inspect);
		return promise;
	}
}

function ok(str) { return showLog(lightgreen(str?str:'>>')); }
function error(str) { return showLog(lightred(str?str:'!!')); }
function warn(str) { return showLog(lightyellow(str?str:'~~')); }
function debug(str) { return showLog(lightcyan(str)); }

exports.ok = ok;
exports.error = error;
exports.warn = warn;
exports.debug = debug;