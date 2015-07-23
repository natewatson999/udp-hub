var dgram = require("dgram");
var ipFormat = require("./addressLogic").ipFormat;
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
	if
};
