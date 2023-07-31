const Obj = {
  name: "GD",
  getName(): String {
    return this.name;
  },
};

const Obj2 = {
  name: "GD-2",
};

let callerFunc = Obj.getName;

// Without Bind
console.log(callerFunc());

// Using inbuilt Bind
callerFunc = callerFunc.bind(Obj);
console.log(callerFunc());

// Using Custom Bind Method
interface Function {
  customBind: Function;
}

// Custom bind definition
Function.prototype.customBind = function (obj: object, ...args1: any[]) {
  let currFunc = this;
  console.log("Now", this);
  console.log("Now2", obj);
  return function (...args2: any[]) {
    return currFunc.apply(obj, [...args1, ...args2]);
  };
};

const callerFunc2 = Obj.getName.customBind(Obj2);

console.log("Applying custom bind", callerFunc2("hello", "hi"));
