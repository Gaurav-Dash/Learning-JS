/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpClient } from "./HttpClient";
import { StorageType } from "./HttpClientTypes";
import { LocalStorageMock, SessionStorageMock } from "./mock/StorageMocks";

globalThis.localStorage = new LocalStorageMock();
globalThis.sessionStorage = new SessionStorageMock();

jest.spyOn(localStorage, "setItem");
jest.spyOn(sessionStorage, "setItem");
jest.spyOn(localStorage, "getItem");
jest.spyOn(sessionStorage, "getItem");
jest.useFakeTimers();
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

// expect the mock to be called
// expect(abortFn).toBeCalledTimes(1);

describe("Testing HTTP Client (In-Memory)", () => {
  const httpClient = new HttpClient({
    useCache: true,
    ttl: 10000,
    cacheStorageType: StorageType.IN_MEMORY,
  });

  test("should fetch data and run setTimeout", async () => {
    expect(await httpClient.get("url")).toEqual({
      someObj: "123",
      anotherObj: "456",
      requestedUrl: "url",
    });
    expect(setTimeout).toHaveBeenCalledTimes(1);
    expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), 10000);
  });

  test("should trigger the cancel when request is running", () => {
    httpClient.get("url1");
    httpClient.cancel("url1");
    expect(abortFn).toBeCalledTimes(1);
  });

  test("should fetch value from Cache storage", async () => {
    const getCachedResultSpy = jest.spyOn<HttpClient, any>(
      httpClient,
      "getCachedResult"
    );
    await httpClient.get("url2");
    await httpClient.get("url2");

    expect(getCachedResultSpy).toBeCalledTimes(1);
    expect(getCachedResultSpy).toBeCalledWith("url2");
  });
  // test("should store cached Value in the local storage", () => {});
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
    expect(localStorage.store).toEqual({
      url4: JSON.stringify({
        cachedResult: {
          requestedUrl: "url4",
          someObj: "123",
          anotherObj: "456",
        },
      }),
    });
  });

  test("should fetch cache value from local storage", async () => {
    const getCachedResultSpy = jest.spyOn<HttpClient, any>(
      httpClient,
      "getCachedResult"
    );
    await httpClient.get("url9");
    await httpClient.get("url9");

    expect(getCachedResultSpy).toBeCalledTimes(1);
    expect(getCachedResultSpy).toBeCalledWith("url9");
    expect(localStorage.getItem).toBeCalledTimes(4);
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
    expect(sessionStorage.store).toEqual({
      url4: JSON.stringify({
        cachedResult: {
          requestedUrl: "url4",
          someObj: "123",
          anotherObj: "456",
        },
      }),
    });
  });
  test("should fetch cache value from session storage", async () => {
    const getCachedResultSpy = jest.spyOn<HttpClient, any>(
      httpClient,
      "getCachedResult"
    );
    await httpClient.get("url6");
    await httpClient.get("url6");

    expect(getCachedResultSpy).toBeCalledTimes(1);
    expect(getCachedResultSpy).toBeCalledWith("url6");
    expect(sessionStorage.getItem).toBeCalledTimes(4);
    getCachedResultSpy.mockClear();
  });
});

describe("Testing HTTP Client (Cache Delete Functionality)", () => {
  const httpClient = new HttpClient({
    useCache: true,
    cacheStorageType: StorageType.IN_MEMORY,
    ttl: 2000,
  });

  test("should delete the cache from memory", async () => {
    jest.clearAllMocks();
    const insertCacheIntoStorageSpy = jest.spyOn<HttpClient, any>(
      httpClient,
      "insertCacheIntoStorage"
    );
    const deleteCacheFromStorageStorageSpy = jest.spyOn<HttpClient, any>(
      httpClient,
      "deleteCacheFromStorage"
    );
    await httpClient.get("url10");

    expect(insertCacheIntoStorageSpy).toBeCalledTimes(1);
    expect(insertCacheIntoStorageSpy.mock.calls[0]).toContain("url10");
    expect(setTimeout).toBeCalledTimes(1);
    jest.runAllTimers();
    expect(deleteCacheFromStorageStorageSpy).toBeCalledTimes(1);
  });
});
