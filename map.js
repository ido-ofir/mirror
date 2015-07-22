
var map = {};
module.exports = {
	set: function(path, value){
		var v = map[path];
		map[path] = value;
		return v !== value;  // !v.$.equals(value) ?
	},
	get: function(path){
		return map[path];
	},
	clear: function(path){
		delete map[path];
	},
    print: function(){
        console.log('map:')
        console.dir(map)
    }
};

/*
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
    },
    print: function(){
        console.log('map:')
        console.dir(map)
    }
};
    */