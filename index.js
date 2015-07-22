

var repl = require('repl');
var context = repl.start({
    prompt: '<>',
    stdin: process.stdin,
    stdout: process.stdout
}).context;

//var Immutable = require('immutable');
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
        enumerable: true,
        get: get,
        set: set
    });
}

function defineHiddenProperty(parent, key, value) {
    Object.defineProperty(parent, key, {
        configurable: false,
        writable: true,
        enumerable: false,
        value: value
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
    },
    set : function(value){
        if(value === this._$.source) return;
        this._$.source = value;
        this.fire('update', this._$);
    },
    get : function(){
        return this._$.mirror.map(function(item){
            return item.$.get();
        });
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

$Primitive.prototype = new Node({
    set : function(value){
        if(getType(value) === 'primitive'){
            if(map.set(this._$.path, value)){
                this._$.source = value;   //   fix me! this is wrong!
                this.fire('update', this._$);
                return value;
            }
        }
    },
    get : function(){
        return map.get(this._$.path);
    }
});

function getChild() {
    if(this.$._$.type === 'primitive') return this.$.get();
    return this;
}

function Mirror(source, path, parent, root) {
    var type = getType(source);
    var mirror, child, $, _$;

    if(!path) path = '';
    if(typeof source === 'object'){
        if(source instanceof Array){
            $ = new $Array(source);
            mirror = [];
            source.forEach(function(item, index){
                mirror.push(Mirror(item, path + '[' + index + ']', mirror, root || mirror));
            });
        }
        else{
            $ = new $Object();
            mirror = {};
            for(var key in source){
                child = Mirror(source[key], (path ? path + '.' : '') + key, mirror, root || mirror);
                defineProperty(mirror, key, getChild.bind(child), child.$.set.bind(child.$));
            }
        }
    }
    else{
        $ = new $Primitive();
        mirror = $;
        map.set(path, source);
    }
    defineHiddenProperty($, '_$', {
        path: path,
        type: type,
        source: source,
        parent: parent,
        mirror: mirror
    });
    defineHiddenProperty(mirror, '$', $);
    return mirror;
}

var a = Mirror({a: [1,2,3], b: {c: 2, d: 3}});
//map.print();
context.a = a;
a.$.on('update', function(update){
    console.log('update:', update.path, update.value);
});

//if(source instanceof Array) watcher = [];