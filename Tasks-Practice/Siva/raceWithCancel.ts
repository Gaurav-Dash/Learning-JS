const builtInFetch = window.fetch;
let controller = new AbortController();
window.fetch = function (...args) {
  const optionArgs =
    args[1] == null
      ? { signal: controller.signal }
      : { ...args[1], signal: controller.signal };

  return builtInFetch.call(window, args[0], optionArgs);
};

// declare interface Promise<T> {
//   raceWithCancel(promises: Promise<T>[]): Promise<T>;
// }

// Promise.prototype.raceWithCancel = async function <T>(promises: Promise<T>[]) {
const raceWithCancel = async function <T>(promises: Promise<T>[]) {
  let modifiedPromises = promises.map((p) => {
    return new Promise(async (resolve, reject) => {
      controller.signal.addEventListener("abort", reject);
      resolve(await p);
    });
  });

  return Promise.race(modifiedPromises).then((res) => {
    controller.abort();
    return res;
  });
};

const timeoutPromise = new Promise((resolve, reject) =>
  setTimeout(() => resolve(2), 100)
);

// Promise.raceWithCancel([
raceWithCancel([
  fetch("https://random-data-api.com/api/users/random_user"),
  fetch("https://random-data-api.com/api/users/random_user"),
  fetch("https://random-data-api.com/api/users/random_user"),
  timeoutPromise,
])
  .then((res) => console.log(res))
  .catch((err) => console.error("Error", err));
