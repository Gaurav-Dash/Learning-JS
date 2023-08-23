class HttpClient {
  constructor() {
    this.abortController = new AbortController();
  }

  async get(url) {
    try {
      const response = await fetch(url, {
        signal: this.abortController.signal,
      });
      return response.json();
    } catch (error) {
      return null;
    }
  }

  cancelRequests() {
    if (!this.abortController.signal.aborted) {
      this.abortController.abort();
    }
  }
}

const httpClient = new HttpClient();

const getPostById = async (reqId) => {
  const data = await httpClient.get(
    `https://random-data-api.com/api/users/random_user?reqId=${reqId}`
  );
  console.log("log", reqId);
  return { ...data, reqId: reqId };
};

Promise.raceWithCancel = function (promises) {
  const promisesWithCancel = promises.map((promise) =>
    Promise.resolve(promise).finally(() => httpClient.cancelRequests())
  );

  return Promise.race(promisesWithCancel);
};

Promise.raceWithCancel([getPostById(1), getPostById(2), getPostById(3)])
  .then((value) => {
    console.log(`Resolved`, value.reqId);
  })
  .catch((reason) => console.log(`Rejected: ${reason.message}`));

//   const abortController = new AbortController();

//   const getPostById = async (reqId) => {
//     try {
//       const response = await fetch(
//         `https://random-data-api.com/api/users/random_user`,
//         { signal: abortController.signal }
//       );
//       const data = await response.json();
//       console.log("log", reqId);
//       abortController.abort(); // Cancel other requests once one resolves
//       return { ...data, reqId: reqId };
//     } catch (error) {
//       return null;
//     }
//   };

//   Promise.race([getPostById(1), getPostById(2), getPostById(3)])
//     .then((value) => {
//       if (value !== null) {
//         console.log(`Resolved`, value.reqId);
//       } else {
//         console.log(`All requests were canceled.`);
//       }
//     })
//     .catch((reason) => console.log(`Rejected: ${reason}`));
