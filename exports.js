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
output.get6Addresses = addressLogic.get6Addresses;
output.get4Addresses = addressLogic.get4Addresses;
output.getAddresses = addressLogic.getAddresses;
module.exports = exports = output;