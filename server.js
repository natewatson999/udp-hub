var dgram = require("dgram");
var events = require("events");
var udp = require("./socket.js");
var ipFormat = require("./addressLogic").ipFormat;

var createServer = function(callback){
	this.socket = udp.createSocket(true, callback);
};
createServer.prototype.bind = function(port, callback){
	this.socket.bind(port, callback);
};
createServer.prototype.setTTL = function(count){
	this.socket.setTTL(count);
};
createServer.prototype.send = function(content, start, end, port, address, callback) {
	this.socket.send(content, start, end, port, address, callback);
};
createServer.prototype.close = function(callback){
	this.socket.close(callback);
};
createServer.prototype.ref = function(){
	this.socket.ref();
};
createServer.prototype.unref = function(){
	this.socket.unref();
};
var createClient = function(content, start, end, port, address, callback, hops){
	var response;
	var format = ipFormat(address);
	if(format == "IPv6") {
		response = dgram.createSocket("udp6");
	} else {
		response = dgram.createSocket("udp4");
	}
	if (hops) {
		response.setTTL(hops);
	}
	response.on("message", function(content, metaData) {
		response.close();
		callback(content, metaData);
	});
	response.on("error", function(err){
		response.close();
		if (format == "IPv6") {
			callback("", {address: "::0", family: format, port: 0, size: 0 }, err);
		} else {
			callback("", {address: "0.0.0.0", family: format, port: 0, size: 0 }, err);		
		}
	});
	response.send(content, start, end, port, address);
	return;
};
var server = {};
server.createServer = function(callback){
	return new createServer(callback);
};
server.createClient = function(content, start, end, port, address, callback) {
	return new createClient(content, start, end, port, address, callback);
};
module.exports = exports = server;