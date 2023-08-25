/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpClient } from "./HttpClient";
import { StorageType } from "./HttpClientTypes";
import { InMemoryStorage, LocalStorage, SessionStorage } from "./Storage";
import { LocalStorageMock, SessionStorageMock } from "./mock/StorageMocks";

globalThis.localStorage = new LocalStorageMock();
globalThis.sessionStorage = new SessionStorageMock();

jest.spyOn(localStorage, "setItem");
jest.spyOn(sessionStorage, "setItem");
jest.spyOn(localStorage, "getItem");
jest.spyOn(sessionStorage, "getItem");
jest.spyOn(globalThis, "setTimeout");

globalThis.fetch = jest.fn((url) =>
  Promise.resolve({
    json: () =>
      Promise.resolve({ requestedUrl: url, someObj: "123", anotherObj: "456" }),
  })
) as jest.Mock;

const abortFn = jest.fn();

globalThis.AbortController = jest.fn(() => ({
  abort: abortFn,
})) as jest.Mock;

describe("Testing HTTP Client (In-Memory)", () => {
  const httpClient = new HttpClient({
    useCache: true,
    ttl: 10000,
    cacheStorageType: StorageType.IN_MEMORY,
  });

  test("should fetch data and run setTimeout", async () => {
    const res = await httpClient.get("url");
    expect(res).toEqual({
      someObj: "123",
      anotherObj: "456",
      requestedUrl: "url",
    });
  });

  test("should trigger the cancel when request is running", () => {
    httpClient.get("url1");
    httpClient.cancel("url1");
    expect(abortFn).toBeCalledTimes(1);
  });

  test("should fetch value from Cache storage", async () => {
    const getCachedResultSpy = jest.spyOn<InMemoryStorage, any>(
      InMemoryStorage.prototype,
      "get"
    );
    await httpClient.get("url2");
    await httpClient.get("url2");

    expect(getCachedResultSpy).toBeCalledTimes(2);
    expect(getCachedResultSpy).toBeCalledWith("url2");
  });
});

describe("Testing HTTP Client (LocalStorage)", () => {
  const httpClient = new HttpClient({
    useCache: true,
    cacheStorageType: StorageType.LOCAL,
    ttl: 10000,
  });

  test("should check if cache is present in localStorage", async () => {
    await httpClient.get("url4");

    expect(localStorage.setItem).toBeCalledTimes(1);
    expect(localStorage.store).toHaveProperty("url4");
    expect(JSON.parse(localStorage.store["url4"])).toHaveProperty(
      "cachedResult"
    );
    expect(JSON.parse(localStorage.store["url4"]).cachedResult).toEqual({
      requestedUrl: "url4",
      someObj: "123",
      anotherObj: "456",
    });
  });

  test("should fetch cache value from local storage", async () => {
    const getCachedResultSpy = jest.spyOn<LocalStorage, any>(
      LocalStorage.prototype,
      "get"
    );

    const checkIfCacheValidSpy = jest.spyOn<HttpClient, any>(
      httpClient,
      "checkIfCacheValid"
    );

    await httpClient.get("url9");
    await httpClient.get("url9");

    expect(getCachedResultSpy).toBeCalledTimes(2);
    expect(checkIfCacheValidSpy).toBeCalledTimes(1);
    expect(getCachedResultSpy).toBeCalledWith("url9");
    expect(localStorage.getItem).toBeCalledTimes(5);
  });
});

describe("Testing HTTP Client (SessionStorage)", () => {
  const httpClient = new HttpClient({
    useCache: true,
    cacheStorageType: StorageType.SESSION,
    ttl: 10000,
  });

  test("should check if cache is present in SessionStorage", async () => {
    await httpClient.get("url4");

    expect(sessionStorage.setItem).toBeCalledTimes(1);
    expect(sessionStorage.store).toHaveProperty("url4");
    expect(JSON.parse(sessionStorage.store["url4"])).toHaveProperty(
      "cachedResult"
    );
    expect(JSON.parse(sessionStorage.store["url4"]).cachedResult).toEqual({
      requestedUrl: "url4",
      someObj: "123",
      anotherObj: "456",
    });
  });
  test("should fetch cache value from session storage", async () => {
    const getCachedResultSpy = jest.spyOn<SessionStorage, any>(
      SessionStorage.prototype,
      "get"
    );
    const checkIfCacheValidSpy = jest.spyOn<HttpClient, any>(
      httpClient,
      "checkIfCacheValid"
    );
    await httpClient.get("url6");
    await httpClient.get("url6");

    expect(getCachedResultSpy).toBeCalledTimes(2);
    expect(checkIfCacheValidSpy).toBeCalledTimes(1);
    expect(getCachedResultSpy).toBeCalledWith("url6");
    expect(sessionStorage.getItem).toBeCalledTimes(5);
    getCachedResultSpy.mockClear();
  });
});

describe("Testing HTTP Client (Miscellaneous Functionalities - delete, request already exists)", () => {
  const httpClient = new HttpClient({
    useCache: true,
    cacheStorageType: StorageType.IN_MEMORY,
    ttl: 100,
  });

  test("should delete the cache from memory", async () => {
    const insertCacheIntoStorageSpy = jest.spyOn<InMemoryStorage, any>(
      InMemoryStorage.prototype,
      "insert"
    );
    const deleteCacheFromStorageStorageSpy = jest.spyOn<InMemoryStorage, any>(
      InMemoryStorage.prototype,
      "delete"
    );

    const checkIfCacheValidSpy = jest.spyOn<HttpClient, any>(
      httpClient,
      "checkIfCacheValid"
    );
    await httpClient.get("url10");
    await new Promise((resolve) => setTimeout(() => resolve(1), 2000));
    await httpClient.get("url10");

    expect(insertCacheIntoStorageSpy).toBeCalledTimes(2);
    expect(insertCacheIntoStorageSpy.mock.calls[0]).toContain("url10");
    expect(checkIfCacheValidSpy).toBeCalledTimes(1);
    expect(deleteCacheFromStorageStorageSpy).toBeCalledTimes(1);
  });

  test("should delete delete running request if new request is sent to the same url", async () => {
    const httpClient1 = new HttpClient({
      useCache: false,
    });
    const checkIfRequestExistsSpy = jest.spyOn<HttpClient, any>(
      httpClient1,
      "checkIfRequestExists"
    );

    globalThis.fetch = jest.fn(
      (url) =>
        new Promise((resolve) => {
          setTimeout(
            () =>
              resolve({
                json: () =>
                  Promise.resolve({
                    requestedUrl: url,
                    someObj: "123",
                    anotherObj: "456",
                  }),
              }),
            1000
          );
        })
    ) as jest.Mock;
    httpClient1.get("url19");
    await new Promise((resolve) => setTimeout(() => resolve(1), 100));
    httpClient1.get("url19");

    expect(checkIfRequestExistsSpy).toBeCalledTimes(2);
    expect(abortFn).toBeCalledTimes(2);
  });
  test("should check if fetch catches error", async () => {
    globalThis.fetch = jest.fn((url) => {
      throw new Error(url);
    }) as jest.Mock;

    try {
      await httpClient.get("url23");
    } catch (error) {
      expect(error.message).toEqual(
        "error occured while fetching request : Error: url23"
      );
    }
  });
});
