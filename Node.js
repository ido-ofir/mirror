
var debugging = true;

function Node(props) {
    for(var m in props){
        this[m] = props[m];
    }
}

function bubble(_$, args) {
    if(_$ && _$.parent){
        _$.parent.$.fire.apply(_$.parent.$, args);   // propagate up the tree
    }
}

var l;

var NodePrototype = {
    on: function(eventName, listener){
        var listeners = this._eventListeners;
        if(!listeners) {
            listeners = {};
            Object.defineProperty(this, '_eventListeners', {
                configurable: false,
                writable: true,
                enumerable: debugging,
                value: listeners
            });
        }
        if(!listeners[eventName]) listeners[eventName] = [];
        listeners[eventName].push(listener);
    },
    off: function(eventName, listener){
        var index, listeners = this._eventListeners;
        if(!listeners) return;
        if(!listeners[eventName]) return;
        if(!listener) {
            delete listeners[eventName];
        }
        else{
            index = listeners[eventName].indexOf(listener);
            if(index >= 0) listeners[eventName].splice(index, 1);
        }
    },
    fire: function(eventName){  // ..args
        var args,
            cancel,
            listeners = this._eventListeners;
        if(!listeners) return bubble(this._$, arguments);
        listeners = listeners[eventName];
        if(!listeners) return bubble(this._$, arguments);
        args = [].slice.call(arguments, 1);
        for(var i = 0; i < listeners.length; i++){
            cancel = listeners[i].apply(this, args);
            if(cancel === false) return;  // cancel the event by returning false
        }
        bubble(this._$, arguments)
    }
};
Node.prototype = NodePrototype;
module.exports = Node;

