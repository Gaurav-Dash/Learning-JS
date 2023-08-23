function deepOmitKeys(obj, keys: string[]) {
  if (typeof obj !== "object" && !Array.isArray(obj)) return obj;

  const clonedObject = Array.isArray(obj) ? [] : {};
  let changeFound = false;

  for (let key in obj) {
    if (keys.includes(key)) {
      changeFound = true;
      continue;
    }

    if (typeof obj[key] == "object") {
      clonedObject[key] = deepOmitKeys(obj[key], keys);
    } else {
      clonedObject[key] = obj[key];
    }

    changeFound = changeFound || clonedObject[key] !== obj[key];
  }

  return changeFound ? clonedObject : obj;
}

const input1 = ["a"];
const input2 = { a: 1, b: null };
const input = {
  a: 1,
  c: {
    a: [1, 2],
    b: [
      { a: 1, x: 2, y: 3 },
      { a: 2, x: 20, y: 30 },
    ],
  },
  d: {
    b: [
      { a: 1, x: 2, y: 3 },
      { x: 20, y: 30 },
    ],
  },
};

console.log(deepOmitKeys(input2, ["a"]));

export { deepOmitKeys };
