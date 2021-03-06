var addressLogic = require("./addressLogic.js");
var ipFormat = addressLogic.ipFormat;
var dgram = require("dgram");
var events = require("events");
var createSocket = function(paramA, paramB){
	var callback = function(){};
	var reuseAddr = false;
	if (paramA) {
		if(paramB) {
			reuseAddr = paramA;
			callback = paramB;
		} else {
			if (typeof paramA === "function") {
				callback = paramA;
			} else {
				reuseAddr = paramA;
			}
		}
	}
	var config6 = {
		reuseAddr: reuseAddr,
		type: "udp6"
	};
	var config4 = {
		reuseAddr: reuseAddr,
		type: "udp4"
	};
	this.emitter = new events.EventEmitter();
	self = this;
	this.socket4 = dgram.createSocket(config4, callback);
	this.socket6 = dgram.createSocket(config6, callback);
	return;
};
createSocket.prototype.on = function(condition, callback) {
	switch(condition) {
		case "listening":
			this.emitter.on("listening", callback);
			break;
		case "message":
			this.socket6.on("message", callback);
			this.socket4.on("message", callback);
			break;
		case "error":
			this.socket6.on("error", callback);
			this.socket4.on("error", callback);
			this.emitter.on("error", callback);
			break;
		case "close":
			this.emitter.on("close", callback);
			break;
		default:
	}
};
createSocket.prototype.close = function(callback) {
	if(callback) {
		this.on("close", callback);
	}
	this.socket4.close();
	this.socket6.close();
	this.emitter.emit("close");
	return;
};
createSocket.prototype.send = function(buf, offset, length, port, address, callback) {
	var type = addressLogic.addressType(address);
	switch (type) {
		case "IPv4":
			this.socket4.send(buf, offset, length, port, address, callback);
			break;
		case "IPv6":
			this.socket6.send(buf, offset, length, port, address, callback);
			break;
		case "DNS":
			var self = this;
			addressLogic.getAddresses(addresses, function(){
				if (addresses.length == 0) {
					this.emitter.emit("error", new Error("DNS error"));
					return;
				}
				self.send(buf, offset, length, port, addresses[0], callback);
			});
			break;
		case "EUI-48":
		case "EUI-64":
		default:
			this.emitter.emit("error", new Error("unusableAddressType"));
			break;
	}
};
createSocket.prototype.bind = function(paramA, paramB, paramC){
	if (paramC) {
		this.on("listening", paramC);
		this.bind(paramA, paramB);
		return;
	}
	if (paramB) {
		if (typeof paramB === "function") {
			this.on("listening", paramB);
			this.bind(paramA);
			return;
		}
	}
	if (paramA) {
		if (typeof paramA === "function") {
			this.on("listening", paramA);
			this.bind();
			return;
		}
	}
	if (!paramA) {
		var self = this;
		this.socket6.bind(function(){
			self.socket4.bind(function(){
				self.emitter.emit("listening");
			});
		});
		return;
	}
	var garbage4 = "203.0.113.1";
	var garbage6 = "2002:cb00:7100::1";
	if (!paramB) {
		if (typeof paramA === "number") {
			var self = this;
			this.socket6.bind(paramA, function(){
				self.socket4.bind(paramA, function(){
					self.emitter.emit("listening");
				});
			});
			return;
		} else {
			var addressType = addressLogic.addressType(paramA);
			var self = this;
			switch (addressType) {
				case "IPv4":
					this.socket6.bind(garbage6, function(){
						self.socket4.bind(paramA, function(){
							self.emitter.emit("listening");
						});
					});
					break;
				case "IPv6":
					this.socket6.bind(paramA, function(){
						self.socket4.bind(garbage4, function(){
							self.emitter.emit("listening");
						});
					});
					break;
				case "DNS":
					this.socket6.bind(paramA, function(){
						self.socket4.bind(paramA, function(){
							self.emitter.emit("listening");
						});
					});
					break;
				default:
					this.emitter.emit("error", new Error("unusableAddressType"));
					break;
			}
			return;
		}
	}
	var addressType = addressLogic.addressType(paramA);
	var self = this;
	switch (addressType) {
		case "IPv4":
			this.socket6.bind(paramA, garbage6, function(){
				self.socket4.bind(paramA, paramB, function(){
					self.emitter.emit("listening");
				});
			});
			break;
		case "IPv6":
			this.socket6.bind(paramA, paramB, function(){
				self.socket4.bind(paramA, garbage4, function(){
					self.emitter.emit("listening");
				});
			});
			break;
		case "DNS":
			this.socket6.bind(paramA, paramB, function(){
				self.socket4.bind(paramA, paramB, function(){
					self.emitter.emit("listening");
				});
			});
			break;
		default:
			this.emitter.emit("error", new Error("unusableAddressType"));
			break;
	}
	return;
};
createSocket.prototype.address = function(){
	var result = {};
	result.udp4 = this.socket4.address();
	result.udp6 = this.socket6.address();
	return result;
};
createSocket.prototype.setTTL = function(value) {
	this.socket4.setTTL(value);
	this.socket6.setTTL(value);
};
createSocket.prototype.setBroadcast = function(value){
	this.socket4.setBroadcast(value);
	if(value==true) {
		this.socket4.setMulticastTTL(64);
	}
	this.socket6.setBroadcast(value);
	if(value==true) {
		this.socket6.setMulticastTTL(64);
	}
};
createSocket.prototype.setMulticastTTL = function(value) {
	this.socket4.setMulticastTTL(value);
	this.socket6.setMulticastTTL(value);
};
createSocket.prototype.setMulticastLoopback = function(value) {
	this.socket4.setMulticastLoopback(value);
	this.socket6.setMulticastLoopback(value);
};
createSocket.prototype.addMembership = function(address, interface){
	var type = addressLogic.addressType(address);
	switch(type) {
		case "IPv4":
			this.socket4.addMembership(address, interface);
			break;
		case "IPv6":
			this.socket6.addMembership(address, interface);
			break;
		case "DNS":
			var self = this;
			addressLogic.getAddresses(addresses, function(){
				if (addresses.length == 0) {
					this.emitter.emit("error", new Error("DNS error"));
					return;
				}
				self.addMembership(addresses[0], interface);
				return;
			});
			break;
		case "EUI-48":
		case "EUI-64":
		default:
			this.emitter.emit("error", new Error("unusableAddressType"));
			break;
	}
};
createSocket.prototype.dropMembership = function(address, interface){
	var type = addressLogic.addressType(address);
	switch(type) {
		case "IPv4":
			this.socket4.dropMembership(address, interface);
			break;
		case "IPv6":
			this.socket6.dropMembership(address, interface);
			break;
		case "DNS":
			var self = this;
			addressLogic.getAddresses(addresses, function(){
				if (addresses.length == 0) {
					this.emitter.emit("error", new Error("DNS error"));
					return;
				}
				self.dropMembership(addresses[0], interface);
				return;
			});
			break;
		case "EUI-48":
		case "EUI-64":
		default:
			this.emitter.emit("error", new Error("unusableAddressType"));
			break;
	}
};
createSocket.prototype.ref = function(){
	this.socket6.ref();
	this.socket4.ref();
};
createSocket.prototype.unref = function(){
	this.socket6.unref();
	this.socket4.unref();
};
var output = {};
output.createSocket = function(paramA, paramB) {
	return new createSocket(paramA, paramB);
};
module.exports = exports = output;
