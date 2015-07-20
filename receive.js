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
	this.client6.on("message", function(message, info){
		this.emitter.emit("message", message, info);
	});
	this.client6.on("error", function(err){
		this.emitter.emit(err);
	});
	this.client4.on("message", function(message, info){
		this.emitter.emit("message", message, info);
	});
	this.client4.on("error", function(err){
		this.emitter.emit(err);
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
}
createReceiver.prototype.setTTL = function(count) {
	this.client6.setTTL(count);
	this.client4.setTTL(count);
}
output.createReceiver = function(){
	return new createReceiver();
};
module.exports = exports = output;
