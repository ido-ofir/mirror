function inherit(proto, extention) {
    var F = function(){};
    for(var m in extention){
        proto[m] = extention;
    }
    F.prototype = proto;
    return F;
}


module.exports = {
    inherit: inherit
};