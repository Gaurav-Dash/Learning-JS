// 1. implement Http Client with request cancellation and caching

type RequestObjectType = {
  [url: string]: {
    cachedResult: any;
    controller: AbortController;
    requestCompleted: boolean;
  };
};

class HttpClient {
  _useCache?: boolean;
  _ttl?: number;
  _requestObj: RequestObjectType;
  constructor({ useCache, ttl }) {
    this._useCache = useCache;
    this._ttl = ttl;
    this._requestObj = {};
  }
  async get(url: string, options?) {
    if (url in this._requestObj && this._requestObj[url].requestCompleted) {
      return this._requestObj[url].cachedResult;
    }

    let controller = new AbortController();
    this._requestObj[url] = {
      cachedResult: null,
      controller: controller,
      requestCompleted: false,
    };
    let timeoutFn = setTimeout(() => {
      delete this._requestObj[url];
    }, this._ttl);
    console.log(url);
    const result = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
      },
    });
    let res = await result.json();
    this._requestObj[url] = await {
      ...this._requestObj[url],
      cachedResult: res,
      requestCompleted: true,
    };

    console.log(this._requestObj);
    console.log("here");
    clearTimeout(timeoutFn);
    return res;
  }

  cancel(url: string) {
    if (!(url in this._requestObj))
      throw new Error("No request has been mad to the url");
    if (this._requestObj[url].requestCompleted)
      throw new Error("Request is settled");

    this._requestObj[url].controller.abort();
    console.log("request aborted");
    return { message: "Request aborted successfully" };
  }
}

// Usage example
const httpClient = new HttpClient({
  useCache: true,
  ttl: 5000,
});

httpClient
  .get("https://random-data-api.com/api/users/random_user")
  .then((data) => console.log("Resolved:", data))
  .catch((err) => console.error("Rejected", err));

httpClient.get("https://jsonplaceholder.typicode.com/posts/1");
httpClient.cancel("https://jsonplaceholder.typicode.com/posts/1");

httpClient
  .get("https://dummyjson.com/products/1")
  .then((res) => {
    console.log(res);
    return httpClient.get("https://dummyjson.com/products/1");
  })
  .then((res) => {
    console.log("second then");
    console.log(res);
  });
