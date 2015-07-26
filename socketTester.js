var udp = require("./exports.js");
var port = 13;
var now = function() {
  var date = new Date();
  return new Buffer(date.toUTCString() + "\r\n");
}
var udpServer = udp.createSocket(function(msg, rinfo){
	var daytime = now();
	udpServer.send(daytime, 0, daytime.length, rinfo.port, rinfo.address);
});
udpServer.on("listening", function(){
	console.log("listening");
});
udpServer.bind(port, function(){
	udpServer.setTTL(64);
});
udpServer.on("close", function(){
	console.log("server closed");
});

var dgram = require('./exports.js');
var message = new Buffer(" ");
var server_ip = '::1';
var server_port = 13;
var client = dgram.createSocket();
client.on('message', function (msg) {
  console.log(msg.toString());
  console.dir(udpServer.address());
  client.close();
  udpServer.close();
});
client.send(message, 0, message.length, server_port, server_ip);