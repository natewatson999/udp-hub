var dgram = require("dgram");
var udp = require("./socket.js");
var ipFormat = require("./addressLogic").ipFormat;
var output = {};
var createReceiver = function (){
	this.socket = udp.createSocket();
	this.on = function(event, callback) {
		switch(event) {
			case "message":
				this.socket.on("message", callback);
				break;
			case "listening":
				this.socket.on("listening", callback);
				break;
			case "error":
				this.socket.on("error", callback);
				break;
			case "close":
				this.socket.on("close", callback);
				break;
			default:
				break;
		}
	};
};
createReceiver.prototype.send = function(message, start, end, port, address, callback){
	this.socket.send(message, start, end, port, address, callback);
	return;
};
createReceiver.prototype.close = function(callback) {
	if (callback) {
		this.on("close", callback);
	}
	this.socket.close();
};
createReceiver.prototype.setTTL = function(count) {
	this.socket.setTTL(count);
};
createReceiver.prototype.addMembership = function(address, interface) {
	this.socket.addMembership(address, interface);
};
createReceiver.prototype.dropMembership = function(address, interface) {
	this.socket.dropMembership(address, interface);
};
output.createReceiver = function(){
	return new createReceiver();
};
module.exports = exports = output;
