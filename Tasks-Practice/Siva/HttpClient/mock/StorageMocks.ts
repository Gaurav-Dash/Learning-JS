export class LocalStorageMock {
  store: object;
  length: number;
  constructor() {
    this.store = {};
  }

  key = jest.fn();

  clear() {
    this.store = {};
  }

  getItem(key) {
    return this.store[key] || null;
  }

  setItem(key, value) {
    this.store[key] = value;
  }

  removeItem(key) {
    delete this.store[key];
  }
}

export class SessionStorageMock {
  store: object;
  length: number;
  constructor() {
    this.store = {};
  }

  key = jest.fn();

  clear() {
    this.store = {};
  }

  getItem(key) {
    return this.store[key] || null;
  }

  setItem(key, value) {
    this.store[key] = value;
  }

  removeItem(key) {
    delete this.store[key];
  }
}
