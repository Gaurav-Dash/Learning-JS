import { deepOmitKeys } from "./deepOmitKeys";

test("should omit keys from a flat obj", () => {
  expect(deepOmitKeys({ a: 1, b: 2 }, ["a"])).toEqual({ b: 2 });
});

test("should not mutate input", () => {
  const i1 = { a: 1, b: 2 };
  deepOmitKeys(i1, ["a"]);
  expect(i1).toEqual({ a: 1, b: 2 });
});

test("should omit keys recursively", () => {
  expect(
    deepOmitKeys({ a: 1, b: 2, c: { a: 1, b: 1, d: 1 } }, ["a", "b"])
  ).toEqual({
    c: {
      d: 1,
    },
  });
});

test("should not create new reference where it is not needed", () => {
  const input = { a: 1, b: { c: 2 } };
  expect(deepOmitKeys(input, ["a"]).b).toBe(input.b);
});

test("should work for properties which are functions", () => {
  const input = { a: 1, b() {} };
  expect(deepOmitKeys(input, ["a"]).b).toBe(input.b);
});

test("should work for arrays", () => {
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
  const output = deepOmitKeys(input, ["a"]);
  expect(output).toEqual({
    c: {
      b: [
        { x: 2, y: 3 },
        { x: 20, y: 30 },
      ],
    },
    d: {
      b: [
        { x: 2, y: 3 },
        { x: 20, y: 30 },
      ],
    },
  });
  expect(output.d.b[1]).toBe(input.d.b[1]);
});

test("should work for corner cases", () => {
  const input = { a: 1, b: null };
  expect(deepOmitKeys(input, ["c"])).toBe(input);
});
