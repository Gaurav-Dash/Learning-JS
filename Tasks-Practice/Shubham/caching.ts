// functions to calculate time taken
// ----- Start ------ //
const now = (eventName = "") => {
  if (eventName) {
    console.log(`Started ${eventName}..`);
  }
  return new Date().getTime();
};

const elapsed = (beginning = start, log = false) => {
  const duration = new Date().getTime() - beginning;
  if (log) {
    console.log(`${duration / 1000}s`);
  }
  return duration;
};
// ----- End ------ //

function cacheWrapperFunction(func) {
  let cache = new Map();
  return function (arg) {
    if (cache.has(arg)) return cache.get(arg);
    let result = func(arg);
    cache.set(arg, result);
    return result;
  };
}

function computeHeavyFunction(arg) {
  let i = 1;

  while (i < 10000000000) i++;

  return arg;
}

let cachedComputeHeavyFunction = cacheWrapperFunction(computeHeavyFunction);
let start = now("compute heavy");
cachedComputeHeavyFunction("string");
elapsed(start, true);

let start2 = now("cached compute heavy");
cachedComputeHeavyFunction(1);
elapsed(start2, true);

// TODO :
// Mulitple arguments handling
