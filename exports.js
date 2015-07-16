var output = {};
var server = require("./server.js");
output.createServer = server.createServer;
output.send = server.send;
output.ipFormat = server.ipFormat;
output.createBroadcaster = require("./broadcast.js").createBroadcaster;
output.createReceiver = require("./receive.js").createReceiver;
module.exports = exports = output;