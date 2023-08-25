// 1. implement Http Client with request cancellation and caching
import { HttpClientArgType, StorageType } from "./HttpClientTypes";
import { InMemoryStorage, LocalStorage, SessionStorage } from "./Storage";

const MILLISECONDS_PER_DAY = 60 * 60 * 24 * 1000; // 86400000

export class HttpClient {
  private useCache?: boolean;
  private ttl?: number;
  private cacheStorage?: LocalStorage | SessionStorage | InMemoryStorage;
  private abortControllers: Record<string, AbortController>;

  // Check if request exits before new request is made.
  constructor({ useCache, ttl, cacheStorageType }: HttpClientArgType) {
    this.useCache = useCache || false;
    this.ttl = ttl || MILLISECONDS_PER_DAY;
    this.abortControllers = {};
    if (cacheStorageType === StorageType.IN_MEMORY)
      this.cacheStorage = new InMemoryStorage();
    if (cacheStorageType === StorageType.LOCAL)
      this.cacheStorage = new LocalStorage();
    if (cacheStorageType === StorageType.SESSION)
      this.cacheStorage = new SessionStorage();
  }

  async get(url: string, options?: object) {
    if (this.useCache && this.cacheStorage.exists(url)) {
      console.log("cache memory triggered");
      if (this.checkIfCacheValid(url)) {
        console.log("cache found in memory");
        return this.cacheStorage.get(url);
      } else {
        console.log("ttl expired");
        this.cacheStorage.delete(url);
      }
    }

    // this.cancel(url)
    // shall I use this ?

    if (this.checkIfRequestExists(url)) {
      this.abortControllers[url].abort();
      delete this.abortControllers[url];
    }

    const controller = new AbortController();
    this.abortControllers[url] = controller;

    try {
      const result = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          "Content-Type": "application/json",
        },
      });
      const res = await result.json();
      if (this.useCache) {
        this.cacheStorage.insert(url, {
          cachedResult: res,
          insertedAt: new Date().getTime(),
        });
      }
      delete this.abortControllers[url];
      return res;
    } catch (error) {
      throw new Error(
        `error occured while fetching request : ${error.toString()}`
      );
    }
  }

  cancel(url: string) {
    if (!this.checkIfRequestExists(url))
      throw new Error("Request does not exist");

    this.abortControllers[url].abort();
    delete this.abortControllers[url];
    console.log("request aborted by user");
    return { message: "Request aborted successfully" };
  }

  private checkIfRequestExists(url: string) {
    return url in this.abortControllers;
  }

  private checkIfCacheValid(url) {
    const currDate = new Date();
    const insertedAt = this.cacheStorage.get(url).insertedAt;
    // inser;
    // console.log("here", insertedAt.getTime(), currDate.getTime());
    return currDate.getTime() - insertedAt < this.ttl;
  }
}

// Factory / Adapter pattern
// // Usage example
// const httpClient = new HttpClient({
//   useCache: true,
//   ttl: 5000,
//   cacheStorageType: StorageType.IN_MEMORY,
// });

// console.log("hi");

// httpClient
//   .get("https://random-data-api.com/api/users/randomuser")
//   .then((data) => console.log("Resolved:", data))
//   .catch((err) => console.error("Rejected", err));

// httpClient.get("https://jsonplaceholder.typicode.com/posts/1");
// httpClient.cancel("https://jsonplaceholder.typicode.com/posts/1");

// httpClient
//   .get("https://dummyjson.com/products/1")
//   .then((res) => {
//     console.log(res);
//     return new Promise((resolve) => {
//       setTimeout(
//         () => resolve(httpClient.get("https://dummyjson.com/products/1")),
//         3000
//       );
//     });
//   })
//   .then((res) => {
//     console.log("second then");
//     console.log(res);
//   });

// testing if deleteCache is getting triggered

// const httpClient = new HttpClient({
//   useCache: true,
//   cacheStorageType: StorageType.IN_MEMORY,
//   ttl: 2000,
// });

// httpClient
//   .get("https://dummyjson.com/products/1")
//   .then(() => {
//     // console.log(res);
//     return new Promise((resolve) => {
//       setTimeout(
//         async () =>
//           resolve(await httpClient.get("https://dummyjson.com/products/1")),
//         1000
//       );
//     });
//   })
//   .then(() => {
//     console.log("second then");
//     // console.log(res);
//   });
