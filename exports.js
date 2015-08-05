var output = {};
var server = require("./server.js");
var addressLogic = require("./addressLogic");
output.ipFormat = addressLogic.ipFormat;
output.addressType = addressLogic.addressType;
output.createServer = server.createServer;
output.createClient = server.createClient;
var broadcast = require("./broadcast.js");
output.createBroadcaster = function(callback) {
	return broadcast.createBroadcaster(callback);
};
output.createReceiver = require("./receive.js").createReceiver;
output.createSocket = require("./socket.js").createSocket;
var dns = require("dns");
output.get6Addresses = function(domainName, callback) {
	dns.resolve6(domainName, function(err, results){
		if (err) {
			callback([]);
			return;
		}
		callback([results]);
		return;
	});
};
output.get4Addresses = function(domainName, callback) {
	dns.resolve4(domainName, function(err, results){
		if (err) {
			callback([]);
			return;
		}
		callback([results]);
		return;
	});
};
output.getAddresses = function(domainName, callback) {
	output.get6Addresses(domainName, function(result6) {
		output.get4Addresses(domainName, function(result4){
			callback(result6.concat(result4));
		});
	});
};
module.exports = exports = output;