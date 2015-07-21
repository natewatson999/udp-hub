var output = {};
var dgram = require("dgram");
var createBroadcaster = function(){
	this.server6 = dgram.createSocket("udp6");
	this.server4 = dgram.createSocket("udp4");
	this.server6.setBroadcast(true);
	this.server4.setBroadcast(true);
	this.server6.setMulticastTTL(64);
	this.server4.setMulticastTTL(64);
};
createBroadcaster.prototype.close = function(callback) {
	this.server6.close();
	this.server4.close();
	callback();
	return;
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
output.createBroadcaster = function(){
	return new createBroadcaster();
};
module.exports = exports = output;