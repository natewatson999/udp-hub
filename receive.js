var dgram = require("dgram");
var ipFormat = require("./addressLogic").ipFormat;
var output = {};
var createReceiver = function (){
	this.client6 = dgram.createSocket("udp6");
	this.client4 = dgram.createSocket("udp4");
	var self = this;
	this.on = function(event, callback) {
		switch(event) {
			case "message":
				self.client6.on("message", callback);
				self.client4.on("message", callback);
				break;
			case "listening":
				self.client6.on("listening", function(){
					self.client4.on("listening", callback);
				});
				break;
			case "error":
				self.client6.on("error", callback);
				self.client4.on("error", callback);
				break;
			case "close":
				self.client6.on("close", callback);
				break;
			default:
				break;
		}
	};
};
createReceiver.prototype.send = function(message, start, end, port, address, callback){
	if (ipFormat(address)=="IPv6") {
		this.client6.send(message, start, end, port, address, callback);
	} else {
		this.client4.send(message, start, end, port, address, callback);
	}
	return;
};
createReceiver.prototype.close = function(callback) {
	var self = this;
	this.client4.close(function(){
		self.client6.close(function(){
			if (callback) {
				callback();
			}
		});
	});
};
createReceiver.prototype.setTTL = function(count) {
	this.client6.setTTL(count);
	this.client4.setTTL(count);
};
createReceiver.prototype.addMembership = function(address, interface) {
	if (ipFormat(address)=="IPv6") {
		if (interface) {
			this.client6.addMembership(address, interface);
		} else {
			this.client6.addMembership(address);
		}
	} else {
		if (interface) {
			this.client4.addMembership(address, interface);
		} else {
			this.client4.addMembership(address);
		}
	}
};
createReceiver.prototype.dropMembership = function(address, interface) {
	if (ipFormat(address)=="IPv6") {
		if (interface) {
			this.client6.dropMembership(address, interface);
		} else {
			this.client6.dropMembership(address);
		}
	} else {
		if (interface) {
			this.client4.dropMembership(address, interface);
		} else {
			this.client4.dropMembership(address);
		}
	}
};
output.createReceiver = function(){
	return new createReceiver();
};
module.exports = exports = output;
