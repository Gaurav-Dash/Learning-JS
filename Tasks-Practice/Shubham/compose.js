var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
function compose() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    var funcArr = args;
    return function (arg) {
        return __spreadArray([arg], funcArr, true).reduce(function (prev, curr) { return curr(prev); });
    };
}
var f = function (x) { return x + 2; };
var g = function (x) { return x + 3; };
var h = function (x) { return x * 2; };
var i = function (x) { return x - 2; };
var j = function (x) { return x * 2; };
console.log(compose(f, g, h, i, j)(2));
