

var repl = require('repl');
var context = repl.start({
    prompt: '<>',
    stdin: process.stdin,
    stdout: process.stdout
}).context;

var Immutable = require('immutable');
var utils = require('./utils.js');
var Node = require('./Node.js');

var map = require('./map.js');

function Args(args) {
    return [].slice.call(args);
}


function getType(target) {
    if(typeof target === 'object'){
        if(target instanceof Array) return 'array';
        return 'object';
    }
    return 'primitive';
}


function defineProperty(parent, key, get, set) {
    Object.defineProperty(parent, key, {
        configurable: true,
        writable: true,
        enumerable: true,
        get: get,
        set: set
    });
}

function $Array() {}
$Array.prototype = new Node({
    push : function(item){
        this._$.source.push(new Mirror(item))
    },
    pop : function(){
        return this._$.source.pop().get();
    },
    splice : function(){
        var args = Args(arguments);
    },
    shift : function(){
        return this._$.source.shift()
    },
    unshift : function(item){
        this._$.source.unshift(new Mirror(item))
    }
});


function $Object() {}

$Object.prototype = new Node({
    set : function(value){
        if(value === this._$.source) return;
        this._$.source = value;
        this.fire('update', this._$);
    },
    get : function(){

    },
    getProperty: function(name){

    },
    delete : function(){

    }
});

function $Primitive() {}
function getChild() {
    return this;
}

$Primitive.prototype = new Node({
    set : function(){
        //this._$.doStuff..
    },
    get : function(){
        return map.get(this._$.path);
    }
});

function Mirror(source, path, parent) {
    var type = getType(source);
    var mirror, child, $, _$;

    if(typeof source === 'object'){

        if(source instanceof Array){
            $ = new $Array(source);
            mirror = source.map(function(item, index){
                return Mirror(item, path + '[' + index + ']', mirror);
            });
        }
        else{
            $ = new $Object();
            mirror = {};
            for(var key in source){
                child = Mirror(source[key], path + '.' + key, mirror);
                defineProperty(mirror, key, getChild.bind(child), child.$.set);
            }
        }
    }
    else{
        $ = new $Primitive();
        mirror = {}
    }
    Object.defineProperty($, '_$', {
        configurable: false,
        writable: true,
        enumerable: false,
        value: {
            path: path,
            type: type,
            source: source,
            parent: parent
        }
    });
    Object.defineProperty(mirror, '$', {
        configurable: false,
        writable: true,
        enumerable: false,
        value: $
    });
    map.set(path, mirror);
    return mirror;
}





function Root(source) {
    var property, watcher = {};
    var immutable = Immutable.Map(source);
    function onChange(key, value, path) {
        var changed = immutable.set(key, value);
        if(changed !== immutable){
            immutable = changed;
            console.log(key, 'changed to ', value);
        }
    }

    function get(prop) {
        return watcher[prop];
    }

    function set(prop, value) {

    }


    for(property in source){
        watcher[property] = new Mirror(source[property], property, onChange);
        defineProperty(this, property, get.bind(property), set.bind(property));
    }

    return watcher;
}

Root.prototype = {

};
function z(a,b) {
    b = 7;
    console.log(arguments);
}

context.y = Root({x: 7});
//if(source instanceof Array) watcher = [];