var users = [
    { 	
    	id: "1", 
    	username: "example1", 
    	password: "1234", 
    	accessToken: null,
    	data: {
    		name: "Bob Smith", 
    		email: "example1@hotmail.com",
    		age: 17
    	}
    },
    { 
    	id: "2", 
    	username: "example2",
    	password: "1234",
    	accessToken: null,
    	data: {
    		name: "Joe Davis",
    		email: "example2@hotmail.com",
    		age: 34
    	}
    }
];

exports.findByUsername = function (username, done) {

	for (var i = 0, len = users.length; i < len; i++) {
		var user = users[i];
		if (user.username === username) {
			return done(user);
		}
	}
	return done(null);
 
};