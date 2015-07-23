var output = {};
output.ipFormat = function(address) {
	if (address.indexOf(":") > -1) {
		return "IPv6";
	}
	return "IPv4";
};
module.exports = exports = output;