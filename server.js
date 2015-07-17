var dgram = require("dgram");
var events = require("events");
var ipFormat = function(address) {
	if (address.indexOf(":") > -1) {
		return "IPv6";
	}
	return "IPv4";
};
var createServer = function(callback){
	var self = this;
	this.server6 = dgram.createSocket("udp6", callback);
	this.server4 = dgram.createSocket("udp4", callback);
};
createServer.prototype.bind = function(port, callback){
	var self = this;
	this.server6.bind(port, function(){
		if (callback) {
			self.server4.bind(port, callback);
		} else {
			self.server4.bind(port);
		}
	});
};
createServer.prototype.send = function(content, start, end, port, address, callback){
	if(ipFormat(address) == "IPv6") {
		if (callback) {
			this.server6.send(content, start, end, port, address, callback);
		} else {
			this.server6.send(content, start, end, port, address);			
		}
	} else {
		if (callback) {
			this.server4.send(content, start, end, port, address, callback);
		} else {
			this.server4.send(content, start, end, port, address);			
		}
	}
};
createServer.prototype.close(callback){
	this.server6.close();
	this.server4.close();
	if (callback) {
		callback();
	}
	return;
}
var createClient = function(content, start, end, port, address, callback){
	if(ipFormat(address) == "IPv6") {
		var client6 = dgram.createSocket("udp6");
		client6.on("message", function(content, metaData) {
			client6.close();
			callback(content, metaData);
		});
		client6.on("error", function(err){
			client6.close();
			callback("", {address: "::0", family: "IPv6", port: 0, size: 0 }, err);
		});
		client6.send(content, start, end, port, address);
	} else {
		var client4 = dgram.createSocket("udp4");
		client4.on("message", function(content, metaData) {
			client4.close();
			callback(content, metaData);
		});
		client4.on("error", function(err){
			client4.close();
			callback("", {address: "0.0.0.0", family: "IPv4", port: 0, size: 0 }, err);
		});
		client4.send(content, start, end, port, address);		
	}
	return;
};
var server = {};
server.createServer = function(callback){
	return new createServer(callback);
};
server.createClient = function(content, start, end, port, address, callback) {
	return new createClient(content, start, end, port, address, callback);
}
server.ipFormat = function(address) {
	return ipFormat(address);
};
module.exports = exports = server;