var output = {};
var addressLogic =  require("./addressLogic.js");
var ipFormat = addressLogic.ipFormat;
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
	var addressType = addressLogic.addressType(address);
	switch (addressType) {
		case "IPv4":
			this.server4.send(buffer, start, end, port, address, callback);	
			break;
		case "IPv6":
			this.server6.send(buffer, start, end, port, address, callback);	
			break;
		case "DNS":
			var addressCode = addressLogic.getAddresses(addresses, function(){
				if (addresses.length==0) {
					callback(new Error("DNSerror"));
				}
				var format = addressLogic.ipFormat(addresses[0]);
				if (format=="IPv6") {
					this.server6.send(buffer, start, end, port, address, callback);							
				} else {
					this.server4.send(buffer, start, end, port, address, callback);			
				}
			});
			break;
		case "EUI-48":
		case "EUI-64":
		default:
			callback(new Error("unusableAddressType"));
			break;
	}
	return;
};
createBroadcaster.prototype.setMulticastLoopback = function(value) {
	this.server6.setMulticastLoopback(value);
	this.server4.setMulticastLoopback(value);
	return;
};
createBroadcaster.prototype.ref = function(){
	this.server6.ref();
	this.server4.ref();
};
createBroadcaster.prototype.unref = function(){
	this.server6.unref();
	this.server4.unref();
};
output.createBroadcaster = function(callback){
	return new createBroadcaster(callback);
};
module.exports = exports = output;
