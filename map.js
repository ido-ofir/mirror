
var map = {};
module.exports = {
	set: function(path, value){
		var l = path.length;
		if(!map[l]) map[l] = {};
		var v = map[l][path];
		map[l][path] = value;
		return v === value;  // v.$.equals(value)
	},
	get: function(path){
		var l = path.length;
		if(!map[l]) return undefined;
		return map[l][path];
	},
	clear: function(path){
		var l = path.length;
		if(!map[l]) return;
		delete map[l][path];
	}
}