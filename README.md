# udp-hub
UDP-hub is a Node.js module designed to provide a module similar to the dgram module that Node provides natively, with the only difference being that dgram requires the developer to handle IPv4 and IPv6, whearas upd-hub is supposed to allow the developer to handle them as one. So rather than making two servers, one for IPv4, and one for IPv6; you can just make one server that can handle both. Note that everything in this module is based on IP addresses. There is no internal support for domain names or NIC addresses. However, there is a set of functions for getting IP addresses from domain names, and a future version will have MAC address support. 

This module is published under the MIT license. A working example that uses the basic features can be found in tester.js.

## Installation Instructions

### Local Installation

In the directory in question, run this command:

```
npm install udp-hub
```

### Global Installation

Assuming you have the rights to do so, run this command:

```
npm install -g udp-hub
```

## Usage instructions

### udpHub.createServer

This function creates a new UDP server. This server, by default, works with all IP addresses, in both IPv4 and IPv6. Its only parameter is a callback function, whose only parameters are the message body, and client information. The message body can be treated as a string. The client information has 4 parameters: address, family, port, and size. address is the client IP address of some format, family is the IP version in either "IPv4" or "IPv6", port is the port number the message was transmitted on, and size is the message size.

#### udpHub.createServer.bind

This function binds this server to a port, with an optional callback. There are two parameters: a port number, and an optional callback.

#### udpHub.createServer.send

This function is intended for responses. It has 5 parameters: a buffer of a response, the starting index of the response, the ending index of the response, the response port number, and the IP address "v6 and v4 are both valid" of the intended client.

#### udpHub.createServer.close

This function closes a server. It has one parameter: an optional parameter-less callback function.

#### Server Example:

```
var udp = require("udp-hub");
var server = udp.createServer(function(message, client){
	console.log(message);
	console.dir(client);
	var response = new Buffer(" \r\n");
	server.send(response, 0, response.length, 666, client.address);
	if(message=="close") {
		server.close();
	}
});
server.bind(666);
```

### udpHub.createClient

This function takes a message, information about it, sends it, and executes a callback for its response. The parameters are content, a buffer of the actual message; start, the beginning index of the buffer; end, the ending index of the buffer; port, the port the server is supposed to get the message on; address, the intended target "IP only"; and callback, the procedure for dealing with the response, if one comes through. The parameters of callback are the actual message, which can be treated as a string; info, which is a javascript object with the following attributes: address, family, port, and size; and err, a Javascript error Object.

#### Client Example:

```
var udp = require("udp-hub");
var message = new Buffer(" \r\n");
var client = udp.createClient(message, 0, message.length, 666, 127.0.0.1, function(message, info, err){
	if(err) {
		console.log(err);
		return;
	}
	console.log(message.toString());
	console.dir(info);
});
```

### Domain Name related functions

#### udpHub.ipFormat

This function takes a valid IP address in string form, and returns either "IPv6" or "IPv4".

#### udpHub.get6Addresses

This function takes a valid domain name, and calls a callback function whose parameter is an array of length zero or more, where each value is an IPv6 address associated to the domain in question.

#### udpHub.get4Addresses

This function takes a valid domain name, and calls a callback function whose parameter is an array of length zero or more, where each value is an IPv4 address associated to the domain in question.

#### udpHub.getAddresses

This function takes a valid domain name, and calls a callback function whose parameter is an array of length zero or more, where each value is an IP address associated to the domain in question.

