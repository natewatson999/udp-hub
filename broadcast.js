var output = {};
var dgram = require("dgram");
var createBroadcaster = function(){
	var server6 = dgram.createSocket("udp6");
	var server4 = dgram.createSocket("udp4");
	server6.setMulticastTTL(64);
	server4.setMulticastTTL(64);
};
createBroadcaster.prototype.close = function(callback) {
	server6.close();
	server4.close();
	callback();
	return;
};
createBroadcaster.prototype.setMulticastTTL = function(value) {
	server6.setMulticastTTL(value);
	server4.setMulticastTTL(value);
}
createBroadcaster.prototype.broadcast = function(buffer, start, end, port, address, callback){
	if (ipFormat(address)=="IPv6") {
		server6.send(buffer, start, end, port, address, callback);
	} else {
		server4.send(buffer, start, end, port, address, callback);		
	}
};
output.createBroadcaster = function(){
	return new createBroadcaster();
};
module.exports = exports = output;