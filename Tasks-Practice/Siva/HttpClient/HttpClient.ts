// 1. implement Http Client with request cancellation and caching
import {
  RequestCacheObjectType,
  HttpClientArgType,
  StorageType,
} from "./HttpClientTypes";

export class HttpClient {
  private useCache?: boolean;
  private ttl?: number;
  private inMemoryCache?: { [url: string]: RequestCacheObjectType };
  private cacheStorageType?: StorageType;
  private abortControllers: { [url: string]: AbortController };

  constructor({ useCache, ttl, cacheStorageType }: HttpClientArgType) {
    this.useCache = useCache || false;
    this.ttl = ttl; // check whether default is needed or not
    this.abortControllers = {};
    this.cacheStorageType = cacheStorageType; // storage
    if (cacheStorageType === StorageType.IN_MEMORY) this.inMemoryCache = {};
    this.deleteCacheFromStorage.bind(this);
  }

  async get(url: string, options?: object) {
    if (this.useCache && this.checkRequestExistsInCache(url)) {
      console.log("Cache memory triggered for ", url);
      return this.getCachedResult(url);
    }

    const controller = new AbortController();
    this.abortControllers[url] = controller;

    try {
      setTimeout(() => {
        console.log("deleting cache memory");
        this.deleteCacheFromStorage(url);
      }, this.ttl);
      const result = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          "Content-Type": "application/json",
        },
      });
      const res = await result.json();
      if (this.useCache) {
        this.insertCacheIntoStorage(url, {
          cachedResult: await res,
        });
      }
      delete this.abortControllers[url];
      // clearTimeout(timeoutFnId);
      return res;
    } catch (error) {
      throw new Error(error as string);
    }
  }

  cancel(url: string) {
    if (!this.checkIfRequestExists(url))
      throw new Error("Request does not exist");

    this.abortControllers[url].abort();
    console.log("request aborted by user");
    return { message: "Request aborted successfully" };
  }

  private checkRequestExistsInCache(url: string): boolean {
    if (this.cacheStorageType === StorageType.IN_MEMORY) {
      return url in this.inMemoryCache!;
    }

    if (this.cacheStorageType === StorageType.LOCAL) {
      const cacheDataString = localStorage.getItem(url);
      return cacheDataString !== null ? true : false;
    }

    if (this.cacheStorageType === StorageType.SESSION) {
      const cacheDataString = sessionStorage.getItem(url);
      return cacheDataString !== null ? true : false;
    }

    return false;
  }

  private checkIfRequestExists(url: string) {
    return url in this.abortControllers;
  }

  private getCachedResult(url: string) {
    if (this.cacheStorageType === StorageType.IN_MEMORY)
      return this.inMemoryCache![url].cachedResult;
    if (this.cacheStorageType === StorageType.LOCAL)
      return JSON.parse(localStorage.getItem(url)).cachedResult;
    if (this.cacheStorageType === StorageType.SESSION)
      return JSON.parse(sessionStorage.getItem(url)).cachedResult;
  }

  private insertCacheIntoStorage(
    url: string,
    requestData: RequestCacheObjectType
  ): void {
    if (this.cacheStorageType === StorageType.IN_MEMORY)
      this.inMemoryCache![url] = requestData;
    if (this.cacheStorageType === StorageType.LOCAL)
      localStorage.setItem(url, JSON.stringify(requestData));
    if (this.cacheStorageType === StorageType.SESSION)
      sessionStorage.setItem(url, JSON.stringify(requestData));
  }

  private deleteCacheFromStorage(url: string) {
    if (this.cacheStorageType === StorageType.IN_MEMORY)
      delete this.inMemoryCache![url];
    if (this.cacheStorageType === StorageType.LOCAL)
      localStorage.removeItem(url);
    if (this.cacheStorageType === StorageType.SESSION)
      sessionStorage.removeItem(url);
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
