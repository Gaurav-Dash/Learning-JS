/**
 *
 * @param promises list of promise arguements
 * @returns true if odd no. of promises resolve, false otherwise
 */

//  Assuming resolve here means fulfilled. (In the context of resolve and reject)
const isOddPromisesFulfilled = async (...promises: Promise<any>[]) => {
  let count = 0;
  for (let i = 0; i < promises.length; i++) {
    count += await promises[i].then((res) => 1).catch((e) => 0);
  }

  return count % 2 ? true : false;
};

export { isOddPromisesFulfilled };
