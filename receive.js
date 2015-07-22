var dgram = require("dgram");
var events = require("events");
var ipFormat = function(address) {
	if (address.indexOf(":") > -1) {
		return "IPv6";
	}
	return "IPv4";
};
var output = {};
var createReceiver = function (){
	this.emitter = new events.EventEmitter();
	this.client6 = dgram.createSocket("udp6");
	this.client4 = dgram.createSocket("udp4");
	var self = this;
	this.client6.on("message", function(message, info){
		self.emitter.emit("message", message, info);
	});
	this.client6.on("error", function(err){
		self.emitter.emit("error", err);
	});
	this.client4.on("message", function(message, info){
		self.emitter.emit("message", message, info);
	});
	this.client4.on("error", function(err){
		self.emitter.emit("error", err);
	});
	this.client6.on("listening", function(){
		self.client4.on("listening", function(){
			self.emitter.emit("listening");
		});
	});
	return this.emitter;
};
createReceiver.prototype.send = function(message, start, end, port, address, callback){
	if (ipFormat(address)=="IPv6") {
		this.client6.send(message, start, end, port, address, callback);
	} else {
		this.client4.send(message, start, end, port, address, callback);
	}
	return;
};
createReceiver.prototype.close = function() {
	this.client4.close();
	this.client6.close();
	this.emitter.emit("close");
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
