const arr: number[] = [1, 2, 3, 4, 5];

const val: number = arr.reduce((prev: number, curr: number) => prev + curr, 0);

console.log(val);

// Custom Reduce

interface ReducerFunction {}

interface ReducerFunctionAndArgs {
  (prev: number, curr: number): number;
}

interface Array {
  customReduce: ReducerFunctionAndArgs;
  prevVal: number;
}

Array.prototype.customReduce = function (
  func: (prev: number, curr: number) => number,
  prevVal: number
): number {
  const arr = this;
  let prev = prevVal;
  for (let ele of arr) {
    prev = func(prev, ele);
  }
  return prev;
};

const custVal: number = arr.customReduce((p, c) => p + c, 1);
console.log(custVal);
