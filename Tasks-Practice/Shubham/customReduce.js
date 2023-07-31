var arr = [1, 2, 3, 4, 5];
var val = arr.reduce(function (prev, curr) { return prev + curr; }, 0);
console.log(val);
Array.prototype.customReduce = function (func, prevVal) {
    var arr = this;
    var prev = prevVal;
    for (var _i = 0, arr_1 = arr; _i < arr_1.length; _i++) {
        var ele = arr_1[_i];
        prev = func(prev, ele);
    }
    return prev;
};
var custVal = arr.customReduce(function (p, c) { return p + c; }, 1);
console.log(custVal);
