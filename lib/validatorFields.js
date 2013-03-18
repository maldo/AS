exports.email = function (email) {
	var re = new RegExp(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
	return re.test(email);
}

/*
* no white-space characters
* minimum length of 8
* makes sure there is at least:
***one non-alpha character
***one upper case character
***one lower case character
*/
exports.password = function (password) {
	var re = new RegExp(/^(?=.*[^a-zA-Z])(?=.*[a-z])(?=.*[A-Z])\S{8,}$/);
	return re.test(password);
}

exports.name = function (name) {
	return (name.length >= 6);
}

exports.url = function (url) {
	//var re = new RegExp(/^(ht|f)tp(s?)\:\/\/[0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*(:(0-9)*)*(\/?)([a-zA-Z0-9\-\.\?\,\'\/\\\+&amp;%\$#_]*)?$/);
	var re = new RegExp(/(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/);
	return re.test(url);
}