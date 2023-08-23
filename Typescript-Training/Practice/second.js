class HttpClient {
  constructor() {
    this.cache = {};
    this.abortControllers = {};
  }

  async get(url, useCache = true) {
    if (useCache && this.cache[url]) {
      console.log("Using cached data1:", this.cache[url]);
      return this.cache[url];
    }

    try {
      // // Check if there's an existing request with the same URL
      if (this.abortControllers[url]) {
        this.abortControllers[url].abort();
      }

      // Create a new AbortController for this request
      const abortController = new AbortController();
      this.abortControllers[url] = abortController;

      const response = await fetch(url, { signal: abortController.signal });
      const data = await response.json();

      this.cache[url] = data;

      return data;
    } catch (error) {
      if (error.name === "AbortError") {
        console.log("Request cancelled:", error.message);
      } else {
        console.error("Error fetching data:", error.message);
      }
    }
  }

  cancel(url) {
    if (this.abortControllers[url]) {
      this.abortControllers[url].abort();
      delete this.abortControllers[url];
      console.log("Request cancelled by user.");
    }
  }
}

// Usage example
const httpClient = new HttpClient();

// Making a GET request
httpClient
  .get("https://random-data-api.com/api/users/random_user")
  .then((data) => {
    console.log("Received data:", data);

    httpClient.get("https://jsonplaceholder.typicode.com/posts/1");

    httpClient
      .get("https://random-data-api.com/api/users/random_user")
      .then((data) => {
        console.log("Received data:", data);
      })
      .catch((error) => {
        console.error("Error:", error.message);
      });

    httpClient.get("https://jsonplaceholder.typicode.com/posts/1").cancel();
  })
  .catch((error) => {
    console.error("Error:", error.message);
  });

// To cancel the request
// httpClient.cancel("https://api.example.com/data")
