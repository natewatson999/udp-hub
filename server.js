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
createServer.prototype.setTTL = function(count) {
	this.server6.setTTL(count);
	this.server4.setTTL(count);
	return;
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
createServer.prototype.close = function(callback) {
	this.server6.close();
	this.server4.close();
	if (callback) {
		callback();
	}
	return;
};
var createClient = function(content, start, end, port, address, callback, hops){
	var response;
	var format = ipFormat(address);
	if(format == "IPv6") {
		response = dgram.createSocket("udp6");
	} else {
		response = dgram.createSocket("udp4");
	}
	if (hops) {
		response.setTTL(hops);
	}
	response.on("message", function(content, metaData) {
		response.close();
		callback(content, metaData);
	});
	response.on("error", function(err){
		response.close();
		if (format == "IPv6") {
			callback("", {address: "::0", family: format, port: 0, size: 0 }, err);
		} else {
			callback("", {address: "0.0.0.0", family: format, port: 0, size: 0 }, err);		
		}
	});
	response.send(content, start, end, port, address);
	return;
};
var server = {};
server.createServer = function(callback){
	return new createServer(callback);
};
server.createClient = function(content, start, end, port, address, callback) {
	return new createClient(content, start, end, port, address, callback);
};
server.ipFormat = function(address) {
	return ipFormat(address);
};
module.exports = exports = server;