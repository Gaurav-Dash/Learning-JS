import { isOddPromisesFulfilled } from "./challenge1";
// import { handleAsyncError } from "./challenge2";
// import { asyncAdd } from "./challenge3";

const resolvedPromise = Promise.resolve(0);
const rejectedPromise = Promise.reject(new Error("Oops"));

describe("Challenge 1", () => {
  test("Case 1", async () => {
    await expect(isOddPromisesFulfilled()).resolves.toBe(false);
  });
  test("Case 2", async () => {
    await expect(
      isOddPromisesFulfilled(resolvedPromise, resolvedPromise)
    ).resolves.toBe(false);
  });
  test("Case 3", async () => {
    await expect(
      isOddPromisesFulfilled(resolvedPromise, rejectedPromise)
    ).resolves.toBe(true);
  });

  test("Case 4", async () => {
    await expect(
      isOddPromisesFulfilled(
        resolvedPromise,
        resolvedPromise,
        resolvedPromise,
        resolvedPromise,
        resolvedPromise,
        resolvedPromise,
        resolvedPromise
      )
    ).resolves.toBe(true);
  });
});

// describe("Challenge 2", () => {
//   test("Case 1", async () => {
//     await expect(handleAsyncError(resolvedPromise)).resolves.toBe(0);
//   });
//   test("Case 2", async () => {
//     await expect(handleAsyncError(rejectedPromise)).resolves.toBe("Oops");
//   });
// });

// describe("Challenge 3", () => {
//   test("Case 1", async () => {
//     await expect(
//       asyncAdd(Promise.resolve(1), Promise.resolve(2), Promise.resolve(3))
//     ).resolves.toBe(6);
//   });
//   test("Case 2", async () => {
//     await expect(
//       asyncAdd(Promise.resolve(1), Promise.resolve(2), Promise.reject(3))
//     ).rejects.toThrow(new Error("Addition failed"));
//   });
// });
