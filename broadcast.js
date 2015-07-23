var output = {};
var ipFormat = require("./addressLogic").ipFormat;
var dgram = require("dgram");
var createBroadcaster = function(callback){
	this.server6 = dgram.createSocket("udp6");
	this.server4 = dgram.createSocket("udp4");
	var self = this;
	this.server6.bind(function(){
		self.server4.bind(function(){
			self.server6.setBroadcast(true);
			self.server6.setMulticastTTL(64);
			self.server4.setBroadcast(true);
			self.server4.setMulticastTTL(64);
			callback();
		});
	});
};
createBroadcaster.prototype.close = function(callback) {
	this.server6.close();
	this.server4.close();
	if (callback) {
		callback();
	}
};
createBroadcaster.prototype.setMulticastTTL = function(value) {
	this.server6.setMulticastTTL(value);
	this.server4.setMulticastTTL(value);
};
createBroadcaster.prototype.broadcast = function(buffer, start, end, port, address, callback){
	if (ipFormat(address)=="IPv6") {
		this.server6.send(buffer, start, end, port, address, callback);
	} else {
		this.server4.send(buffer, start, end, port, address, callback);		
	}
};
createBroadcaster.prototype.setMulticastLoopback = function(value) {
	this.server6.setMulticastLoopback(value);
	this.server4.setMulticastLoopback(value);
	return;
};
output.createBroadcaster = function(callback){
	return new createBroadcaster(callback);
};
module.exports = exports = output;