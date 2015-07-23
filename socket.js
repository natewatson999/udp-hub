var ipFormat = require("./addressLogic").ipFormat;
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
		family: "udp6"
	};
	var config4 = {
		reuseAddr: reuseAddr,
		family: "udp4"
	};
	this.emitter = new events.EventEmitter();
	self = this;
	this.socket6 = dgram.createSocket(config6, function(){
		self.socket4 = dgram.createSocket(config4, callback);
	});
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
			break;
		case "close":
			this.emitter.on("close", callback);
			break;
		default:
	}
};
