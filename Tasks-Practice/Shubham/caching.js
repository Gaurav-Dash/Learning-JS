// functions to calculate time taken
// ----- Start ------ //
var now = function (eventName) {
    if (eventName === void 0) { eventName = ""; }
    if (eventName) {
        console.log("Started ".concat(eventName, ".."));
    }
    return new Date().getTime();
};
var elapsed = function (beginning, log) {
    if (beginning === void 0) { beginning = start; }
    if (log === void 0) { log = false; }
    var duration = new Date().getTime() - beginning;
    if (log) {
        console.log("".concat(duration / 1000, "s"));
    }
    return duration;
};
// ----- End ------ //
function cacheWrapperFunction(func) {
    var cache = new Map();
    return function (arg) {
        if (cache.has(arg))
            return cache.get(arg);
        var result = func(arg);
        cache.set(arg, result);
        return result;
    };
}
function computeHeavyFunction(arg) {
    var i = 1;
    while (i < 10000000000)
        i++;
    return arg;
}
var cachedComputeHeavyFunction = cacheWrapperFunction(computeHeavyFunction);
var start = now("compute heavy");
cachedComputeHeavyFunction(1);
elapsed(start, true);
var start2 = now("cached compute heavy");
cachedComputeHeavyFunction(1);
elapsed(start2, true);
