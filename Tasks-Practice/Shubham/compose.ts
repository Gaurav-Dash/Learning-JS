function compose(
  ...args: {
    (arg: number): number;
  }[]
) {
  let funcArr = args;
  return (arg) => {
    return [arg, ...funcArr].reduce((prev, curr) => curr(prev));
  };
}

const f = (x) => x + 2;
const g = (x) => x + 3;
const h = (x) => x * 2;
const i = (x) => x - 2;
const j = (x) => x * 2;

console.log(compose(f, g, h, i, j)(2));
