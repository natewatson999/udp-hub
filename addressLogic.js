var output = {};
var punycode = require("punycode");
output.addressType = function(address) {
	var VPI8regex = new RegExp("(0|1){8,8}","g");
	if (VPI8regex.test(address)==true) {
		return "VPI-UNI"
	}
	var VPI12regex = new RegExp("(0|1){12,12}","g");
	if (VPI12regex.test(address)==true) {
		return "VPI-NNI"
	}
	var VPI16regex = new RegExp("(0|1){16,16}","g");
	if (VPI16regex.test(address)==true) {
		return "VCI"
	}
	var MAC48regex = rew RegExp("^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$");
	if (MAC48regex.test(address)==true) {
		return "EUI-48";
	}
	var MAC64regex = rew RegExp("^([0-9A-Fa-f]{2}[:-]){7}([0-9A-Fa-f]{2})$");
	if (MAC64regex.test(address)==true) {
		return "EUI-64";
	}
	var IPv4regex = new RegExp("^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$");
	if ((IPv4regex.test(Address))== true) {
		return "IPv4";
	}
	var IPv6regex = RegExp("(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))");
	if ((IPv6regex.test(Address))== true) {
		return "IPv6";
	}
	if ("localhost"==address) {
		return "DNS"
	}
	var url = punycode.toASCII(address);
	var DNSregex = RegExp("(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]", ig);
	if (DNSregex.test(url)==true) {
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
module.exports = exports = output;