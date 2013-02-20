var clients = [
    { id: '1', name: 'Samplr', clientId: 'clientid1', clientSecret: 'ClientServerSecret' },
    { id: '2', name: 'Juma Host', clientId: 'Juma Host', clientSecret: 'host1secret'}
];


exports.find = function(id, done) {
  for (var i = 0, len = clients.length; i < len; i++) {
    var client = clients[i];
    if (client.id === id) {
      return done(null, client);
    }
  }
  return done(null, null);
};

exports.findByClientId = function(clientId, done) {
  for (var i = 0, len = clients.length; i < len; i++) {
    var client = clients[i];
    if (client.clientId === clientId) {
      return done(null, client);
    }
  }
  return done(null, null);
};
