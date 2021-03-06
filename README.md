# udp-hub
UDP-hub is a Node.js module designed to provide a module similar to the dgram module that Node provides natively, with the only difference being that dgram requires the developer to handle IPv4 and IPv6, whearas upd-hub is supposed to allow the developer to handle them as one. So rather than making two servers, one for IPv4, and one for IPv6; you can just make one server that can handle both. Note that everything in this module is based on IP addresses. There is no support for NIC addresses, and domain name support is in beta. Future versions will have MAC address support. 

This module is published under the MIT license. A working example that uses the basic features can be found in tester.js.

This module provides the following:
* server: This is for networked services. It behaves kind of like the http's createServer features, except it's UDP.
* client: This is for simple 1-time requests with simple 1-time responses. It's kind of like the get function in the http module, except it's more callback oriented.
* receiver: This is meant to be as close as feasable to the way dgram lets the developer make clients. It's meant for cases where there may be more than one outward-bound transmission and/or more than one response. 
* broadcaster: This is for sending broadcasts. 
* socket: These are as close as possible to the sockets the dgram module provides. This has almost all of the same functions as the dgram module.
* Some utility functions for dealing with various addresses.

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

This function is intended for responses. It has 5 parameters: a buffer of a response, the starting index of the response, the size of the response, the response port number, and the address "IPv4, IPv6, and DNS addresses are all valid" of the intended client. There is an optional 6th parameter: a callback function that is fired when either the response is sent or if there is an error in the response. The function has one parameter: a possibly-null error object.

#### udpHub.createServer.close

This function closes a server. It has one parameter: an optional parameter-less callback function.

#### udpHub.createServer.setTTL

This function has one parameter: count. This changes the number of hops a packet is allowed to make if it's sent. It can be any integer between 1 and 255. Most systems default to 64. Certain network configurations will change this number on the fly, so this method is not reliable. 

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

### udpHub.createServer.ref()

Sets this server to the default behavior: if this server is still open, then the script will continue running.

### udpHub.createServer.unref()

Sets the server so that if this server has the only sockets left running, then the script will end. Non-default, and not recommend. 

### udpHub.createClient

This function takes a message, information about it, sends it, and executes a callback for its response. The parameters are content, a buffer of the actual message; start, the beginning index of the buffer; size, the size of the datagram; port, the port the server is supposed to get the message on; address, the intended target "IPv4, IPv6, and DNS address"; callback, the procedure for dealing with the response, if one comes through; and hops, an optional parameter that specifies the number of IP hops allowed. The parameters of callback are the actual message, which can be treated as a string; info, which is a javascript object with the following attributes: address, family, port, and size; and err, a Javascript error Object.

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

### udpHub.createReceiver

This is indended for cases where one has a UDP client, but it may transmit more than once or may receive more than one response. When made, it returns an event emitter.

#### udpHub.createReceiver.emitter.on("message")

Emitted when a response is received. Has two parameters: message and info. These are identical to dgram's message emission.

#### udpHub.createReceiver.emitter.on("err")

Emitted when there's an error of some kind. Has one parameter: error. The error object is identical to the ones found in the dgram module.

#### udpHub.createReceiver.emitter.on("close")

Emitted when the receiver is closed. Has no parameters. 

#### udpHub.createReceiver.emitter.on("listening")

Emitted when the receiver is listening for both IPv4 and IPv6.

#### udpHub.createReceiver.close()

This function closes this receiver. No new sends will be allowed, and no new responses will be allowed. IPv4 traffic is stopped before IPv6, so there may be some quirks that result. Causes the close event to fire. One optional parameter: a callback function with no parameters.

#### udpHub.createReceiver.setTTL

This function has one parameter: count. This changes the number of hops a packet is allowed to make if it's sent. It can be any integer between 1 and 255. Most systems default to 64. Certain network configurations will change this number on the fly, so this method is not reliable. 

#### udpHub.createReceiver.addMembership

This function adds this receiver to the list of sockets listening to a broadcast address. The broadcast address is either an IPv4, DNS, or IPv6 address, given as the zeroth parameter. The last parameter is optional, the multicast interface. 

#### udpHub.createReceiver.dropMembership

This function removes this receiver from the list of sockets listening to a broadcast address. The parameters are identicall to createReceiver.addMembership, and the code is mostly copy-pasted.

#### udpHub.createReceiver.send

This function is for sending UDP data. The parameters are message, a Buffer of the message; start, the beginning index of the buffer; size, the size of the transmission; port, the port the data is to be sent on; address, the address of the machine that will receive this packet "IPv4, IPv6, or DNS addresses"; and callback, an optional function that is fired when the datagram is sent with one paramter: an error object. This is identical to the send function in the dgram module. 

### udpHub.createReceiver.ref()

Sets this receiver to the default behavior: if this receiver is still open, then the script will continue running.

### udpHub.createReceiver.unref()

Sets the receiver so that if this receiver has the only sockets left running, then the script will end. Non-default, and not recommend. 

#### udpHub.createReceiver Example:

```
var receiver = udp.createReceiver();
receiver.on("listening", function(){
	console.log("listening");
	/*You won't see this.*/
});
receiver.on("error", function(err){
	console.log(err);
});
receiver.on("message", function(message, info){
	console.log(message);
	console.dir(info);
	console.log("received");
	receiver.close();
});
receiver.on("close", function(){
	console.log("close");
});
var second = new Buffer(" ");
var serverAddress = "::1";
receiver.send(second, 0, second.length, port, serverAddress);
```

### udpHub.createBroadcaster

These objects are for broadcasting datagrams. The constructor has one parameter: a mandatory callback. 

#### createBroadcaster.close

This function closes this broadcaster, with an optional callback.

#### createBroadcaster.setMulticastTTL

This function takes an integer between 0 and 255, and sets the broadcast ttl of the sockets to the number. The default is 64, regardless of platform.

#### createBroadcaster.setMulticastLoopback

This function sets the IP_MULTICAST_LOOP of the sockets to either false or true, depending on the parameter.

#### createBroadcaster.broadcast

This function broadcasts a message. The parameters are the message in the form a buffer, starting index, size, broadcasting port, broadcast address, and an optional callback. The callback's only parameter is an error object.

### udpHub.createBroadcaster.ref()

Sets this broadcaster to the default behavior: if this broadcaster is still open, then the script will continue running.

### udpHub.createBroadcaster.unref()

Sets this broadcaster so that if this broadcaster has the only sockets left running, then the script will end. Non-default, and not recommend. 

### udpHub.createSocket([reuseAddr][, callback])

This function creates a new socket. There are 2 parameters, both of which are optional, but must be in order: reuseAddr and a callback function. When reuseAddr is true, socket.bind() will reuse the address, even if another process has already bound a socket on it. reuseAddr defaults to false. The callback function gets put into an event listener for a message.

#### udpHub.createSocket.emitter.on("message")

Emitted when a response is received. Has two parameters: message and info. These are identical to dgram's message emission.

#### udpHub.createSocket.emitter.on("err")

Emitted when there's an error of some kind. Has one parameter: error. The error object is identical to the ones found in the dgram module.

#### udpHub.createSocket.emitter.on("close")

Emitted when the receiver is closed. Has no parameters. 

#### udpHub.createSocket.emitter.on("listening")

Emitted when the receiver is listening for both IPv4 and IPv6.

#### udpHub.createSocket.close([callback])

Closes this socket. The callback is turned into a close event listener.

#### udpHub.createSocket.send(buf, offset, length, port, address, callback)

Sends data to address. Buf is a Buffer object, offset is the starting index, length is the size, port is the port being sent on, address is the recipient, and callback is an optional callback. Callback is fired when the Buffer is usable again, and has one parameter: an error object which may result from the send.

#### udpHub.createSocket.address()

Returns an object with two values: "udp4" and "udp6". The two are each address objects, as defined in the <a href="https://nodejs.org/api/dgram.html">dgram documentation</a>.

#### udpHub.createSocket.bind(port, address, callback)

Binds this socket so that it's perpetually active. If port is specified, then the socket will listen on that port; and if port is not specified, a port will be randomly assigned from the non-well-known ports "Or as I like to call them, the Dancing With The Stars ports". I advise to have a port specified. If callback is specified, it is to have no parameters, and will be exectued when this socket fires "listening". If address is specified, this socket will ignore all data that doesn't come from this address. I advise against using address. Address can be in the forms of DNS, IPv4, or IPv6. 

#### udpHub.createSocket.setTTL(count)

This function has one parameter: count. This changes the number of hops a packet is allowed to make if it's sent. It can be any integer between 1 and 255. Most systems default to 64. Certain network configurations will change this number on the fly, so this method is not reliable. 

#### udpHub.createSocket.setBroadcast(value)

Sets this socket so that it's either capable of broadcasting or not capable of broadcasting. If value is true, then the multicastTTL is reset to 64.

#### udpHub.createSocket.setMulticastTTL(count)

This sets the number of hops a packet emitted from this socket can take, if it's broadcasted. The default is 64. However, some network configurations change hops, so this method is unreliable.

#### udpHub.createSocket.setMulticastLoopback(value)

This takes true or false, and uses this to specify if this socket should receive any packets that it broadcasts.

#### udpHub.createSocket.addMembership(address, interface)

Tells the kernel to join a multicast group.

#### udpHub.createSocket.dropMembership(address, interface)

Tells the kernel to remove this socket from a multicast group.

#### udpHub.createSocket.ref()

Sets this socket so that if it's the only open socket, the script will continue executing. The default behavior.

#### udpHub.createSocket.unref()

Sets this socket so that if it's still open, but it's the only thing executing, the script can close.

### Domain Name related functions

#### udpHub.ipFormat

This function takes a valid IP address in string form, and returns either "IPv6" or "IPv4".

#### udpHub.addressType

This function takes an address of some type in a string, and returns the type of the address. It may have the following results:
* "VPI-UNI" 8-bit Virtual Path Identifier
* "VPI-UNI" 12-bit Virtual Path Identifier
* "VCI" Virtual Channel Identifier
* "EUI-48" 48 bit MAC address, the normal kind
* "EUI-64" 64 bit MAC address, used in certain IPv6 cases and Firewire
* "IPv4" IPv4 address
* "IPv6" IPv6 address
* "DNS" valid domain name
* "unknown" unknown

"EUI-48" and "EUI-64" are copyrights of the IEEE. 

#### udpHub.get6Addresses

This function takes a valid domain name, and calls a callback function whose parameter is an array of length zero or more, where each value is an IPv6 address associated to the domain in question.

#### udpHub.get4Addresses

This function takes a valid domain name, and calls a callback function whose parameter is an array of length zero or more, where each value is an IPv4 address associated to the domain in question.

#### udpHub.getAddresses

This function takes a valid domain name, and calls a callback function whose parameter is an array of length zero or more, where each value is an IP address associated to the domain in question.

