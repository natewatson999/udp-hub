var udp = require("./exports.js");
var port = 13;
var now = function() {
  var date = new Date();
  return new Buffer(date.toUTCString() + "\r\n");
}
var udpserver = udp.createServer(function(msg, rinfo) {
  var daytime = now();
  udpserver.send(daytime, 0, daytime.length, rinfo.port, rinfo.address);
  console.dir(rinfo);
  console.log(msg);
});
udpserver.bind(port);
var message = new Buffer(" ");
var server_ip = '127.0.0.1';
var standardClient = udp.createClient(message, 0, message.length, port, server_ip, function(message, info, err){
	if(err) {
		console.log(err);
		return;
	}
	console.log(message.toString());
	console.dir(info);
});
var receiver = udp.createReceiver();
receiver.on("listening", function(){
	console.log("listening");
});
receiver.on("error", function(err){
	console.log(err);
});
receiver.on("message", function(message, info){
	console.log(message);
	console.dir(info);
	console.log("received");
	receiver.close();
	udpserver.close();
});
receiver.on("close", function(){
	console.log("close");
});
var second = new Buffer(" ");
var serverAddress = "::1";
receiver.send(second, 0, second.length, port, serverAddress);
var socketAPI = require("./socket.js");
var socket = socketAPI.createSocket();
socket.on("close", function(){
	console.log("close again");
});
socket.close();
console.log("reached");
var broadcaster = udp.createBroadcaster(function(){
	broadcaster.close();
});
console.log(udp.addressType("127.0.0.1"));
console.log(udp.addressType("::1"));
console.log(udp.addressType("01-23-45-67-89-AB"));
console.log(udp.addressType("01-23-45-67-89-AB-CD-EF"));
console.log(udp.addressType("localhost"));
console.log(udp.addressType("google.com"));
console.log(udp.addressType("error inducer"));