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
	this.socket6.on("listening", function(){
		self.open6 = true;
	});
	this.socket4.on("listening", function(){
		self.open4 = true;
	});
	this.socket6 = dgram.createSocket(config6, function(){
		self.socket4 = dgram.createSocket(config4, function(){
			self.socket4.setTTL(64);
			self.socket6.setTTL(64);
			callback();
		});
	});
	return;
};
createSocket.prototype.close(callback) {
	if(callback) {
		this.on("close", callback);
	}
	var self = this;
	var end = function(){
		self.emitter.emit("close");
	};
	var kill4 = function(){
		if(self.open4) {
			self.open4 = false;
			self.socket4.close(function(){
				self.emitter.emit("close");
			});
		} else {
			self.emitter.emit("close");
		}
		return;
	};
	if (self.open6) {
		self.open6 = false;
		self.socket6.close(kill4);
	} else {
		kill4();
	}
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
createSocket.prototype.send = function(buf, offset, length, port, address, callback) {
	if (ipFormat(address)=="IPv6") {
		this.socket6.send(buf, offset, length, port, address, callback);
	} else {
		this.socket4.send(buf, offset, length, port, address, callback);
	}
};
createSocket.prototype.bind = function(paramA, paramB, paramC){
	var self = this;
	if (!(paramA)) {
		this.socket6.bind(function(){
			self.socket4.bind( function() {
				self.emitter.emit("listening");
			});
		});
		return;
	}
	if (typeof paramA === "function") {
		this.on("listening", paramA)
		this.bind();
		return;
	}
	if (paramB) {
		if(typeof paramB === "function") {
			this.on("listening", paramB)
			this.bind(paramA);
			return;
		}
	}
	if (paramC) {
		this.on("listening", paramC)
		this.bind(paramA, paramB);
		return;
	}
	if (paramB) {
		if(ipFormat(paramB) == "IPv6") {
			this.socket6.bind(paramA, paramB, function(){
				self.emitter.emit("listening");
			});
		} else {
			this.socket4.bind(paramA, paramB, function(){
				self.emitter.emit("listening");
			});
		}
		return;
	}
	if (typeof paramA === "number") {
		this.socket6.bind(paramA, function(){
			self.socket4.bind(paramA, function(){
				self.emitter.emit("listening");
			});
		});
		return;
	}
	if(ipFormat(paramA) == "IPv6") {
		this.socket6.bind(paramA, function(){
			self.emitter.emit("listening");
		});
		return;
	}
	this.socket4.bind(paramA, function(){
		self.emitter.emit("listening");
	});
	return;
};
createSocket.prototype.address = function(){
	var result = {};
	if(this.open4 == true) {
		var address4 = this.socket4.address();
		result.udp4.address = address4.address;
		result.udp4.family = address4.family;
		result.udp4.port = address.port;
	}
	if(this.open4 == true) {
		var address6 = this.socket6.address();
		result.udp6.address = address6.address;
		result.udp6.family = address6.family;
		result.udp6.port = address.port;
	}
	return result;
};
createSocket.prototype.setBroadcast = function(value){
	if(this.open4 == true) {
		this.socket4.setBroadcast(value);
	}
	if(this.open6 == true) {
		this.socket6.setBroadcast(value);
	}
};
createSocket.prototype.setTTL = function(value) {
	this.socket4.setTTL(value);
	this.socket6.setTTL(value);
};