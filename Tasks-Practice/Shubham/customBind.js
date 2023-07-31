var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var Obj = {
    name: "GD",
    getName: function () {
        return this.name;
    },
};
var Obj2 = {
    name: "GD-2",
};
var callerFunc = Obj.getName;
// Without Bind
console.log(callerFunc());
// Using inbuilt Bind
callerFunc = callerFunc.bind(Obj);
console.log(callerFunc());
// Custom bind definition
Function.prototype.customBind = function (obj) {
    var args1 = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args1[_i - 1] = arguments[_i];
    }
    var currFunc = this;
    console.log("Now", this);
    console.log("Now2", obj);
    return function () {
        var args2 = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args2[_i] = arguments[_i];
        }
        return currFunc.apply(obj, __spreadArray(__spreadArray([], args1, true), args2, true));
    };
};
var callerFunc2 = Obj.getName.customBind(Obj2);
console.log("Applying custom bind", callerFunc2());
