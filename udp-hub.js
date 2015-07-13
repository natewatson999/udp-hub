var dgram = require("dgram");
var events = require("events");
var output = {};
function createSocket(callback){
	this.emitter = new events.EventEmitter();
	this.server4 = dgram.createSocket("udp4");
	this.server6 = dgram.createSocket("udp6");
	if (callback) {
		callback(this.emitter);
	}
	return this.emitter;
};
createSocket.prototype.bind = function(port, callback){
	var self = this;
	server4.on("message", function(message, remote){
		self.emmiter.emit("message", message, remote)
	});
	server6.on("message", function(message, remote){
		self.emmiter.emit("message", message, remote)
	});
	this.server4.on("listening", function(){
		self.server6.on("listening", function(){
			self.emitter.emit("listening");
		});
		self.server6.bind({
			port: port,
			address: "::0",
			exclusive: false	
		});
	});
	this.server4.bind({
		port: port,
		address: "0.0.0.0",
		exclusive: false	
	});
	return;
};
output.createSocket = function(callback){
	return new createSocket(callback);
};
module.exports = exports = output;
