#UMA

##Authorization Server (AS)

The AS is the key part of the UMA protocol. It's a central server where you can control different resources from different servers across the network with different privacies.
UMA protocol have two more pieces the Resource Server managed by the resource owner and the Client Server managed by the Requesting Party.

##The server
To execute the server remember to inicializate a Redis instance and a MongoDB one.
	npm start