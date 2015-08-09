var output = {};
var punycode = require("punycode");
output.isDomain = function(address) {
	if (!address) {
		return false;
	}
	if (address=="localhost") {
		return true;
	}
	var url = punycode.encode(address);
	if (address.length > 253) {
		return false;
	}
	var segments = address.split(".");
	if(segments.length < 2) {
		return false;
	}
	var pattern = new RegExp("([A-Z]|[a-z]|[0-9]|_|-)","g");
	for(var index = 0; index < segments.length; index++) {
		if (segments[index].length==0) {
			return false;
		}
		if(pattern.test(segments[index])==false) {
			return false;
		}
	}
	return true;
};
output.addressType = function(address) {
	var VPI8regex = new RegExp("(0|1){8,8}","g");
	if (VPI8regex.test(address)==true) {
		return "VPI-UNI";
	}
	var VPI12regex = new RegExp("(0|1){12,12}","g");
	if (VPI12regex.test(address)==true) {
		return "VPI-NNI";
	}
	var VPI16regex = new RegExp("(0|1){16,16}","g");
	if (VPI16regex.test(address)==true) {
		return "VCI";
	}
	var MAC48regex = new RegExp("^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$");
	if (MAC48regex.test(address)==true) {
		return "EUI-48";
	}
	var MAC64regex = new RegExp("^([0-9A-Fa-f]{2}[:-]){7}([0-9A-Fa-f]{2})$");
	if (MAC64regex.test(address)==true) {
		return "EUI-64";
	}
	var IPv4regex = new RegExp("^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$");
	if ((IPv4regex.test(address))== true) {
		return "IPv4";
	}
	var IPv6regex = RegExp("(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))");
	if ((IPv6regex.test(address))== true) {
		return "IPv6";
	}
	if (output.isDomain(address)==true) {
		return "DNS";
	}
	return "unknown";
};
output.ipFormat = function(address) {
	if (address.indexOf(":") > -1) {
		return "IPv6";
	}
	return "IPv4";
};
output.get6Addresses = function(domainName, callback) {
	dns.resolve6(domainName, function(err, results){
		if (err) {
			callback([]);
			return;
		}
		callback(results);
		return;
	});
};
output.get4Addresses = function(domainName, callback) {
	dns.resolve4(domainName, function(err, results){
		if (err) {
			callback([]);
			return;
		}
		callback(results);
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
var dns = require("dns");
module.exports = exports = output;