
function Node(props) {
    for(var m in props){
        this[m] = props[m];
    }
}

var NodePrototype = {
    on: function(eventName, listener){
        var listeners = this._eventListeners;
        if(!listeners) {
            listeners = {};
            Object.defineProperty(this, '_eventListeners', {
                configurable: false,
                writable: true,
                enumerable: false,
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
        if(!listeners) return;
        listeners = listeners[eventName];
        if(!listeners) return;
        args = [].slice.call(arguments, 1);
        for(var i = 0; i < listeners.length; i++){
            cancel = listeners[i].apply(this, args);
            if(cancel === false) return;  // cancel the event by returning false
        }
        if(this._$.parent){
            this._$.parent.fire.apply(this._$.parent, arguments);   // propagate up the tree
        }
    }
};
Node.prototype = NodePrototype;
module.exports = Node;

