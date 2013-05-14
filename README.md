#UMA

##Authorization Server (AS)

The AS is the key part of the UMA protocol. It's a central server where you can control different resources from different servers across the network with different privacies.
UMA protocol have two more pieces the Resource Server managed by the resource owner and the Client Server managed by the Requesting Party.

##The server
To execute the server, remember to inicializate a Redis instance and a MongoDB. The AS starts in cluster mode and with http by default. You can start it with:

	npm start

That it translates into:

	node app.js

If you want to configure the AS, you need to modify the config file, where all the config variables are defined.
There you can configure:
- MongoDB
- Redis
- Application Options, like cluster, port or ip 
- Security
- Github id
- Winston logger configuration