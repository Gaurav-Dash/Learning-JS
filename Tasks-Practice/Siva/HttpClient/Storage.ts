import { RequestCacheObjectType, StorageType } from "./HttpClientTypes";

export interface Storage {
  type: StorageType;
  insert(key: string, value: RequestCacheObjectType): void;
  get(key: string): RequestCacheObjectType;
  exists(key: string): boolean;
  delete(key: string): void;
}

export class LocalStorage implements Storage {
  type: StorageType;
  constructor() {
    this.type = StorageType.LOCAL;
  }
  insert(key, value: RequestCacheObjectType): void {
    localStorage.setItem(key, JSON.stringify(value));
  }
  get(key): RequestCacheObjectType {
    return JSON.parse(localStorage.getItem(key)); ////// check
  }
  exists(key: string): boolean {
    const cacheDataString = localStorage.getItem(key);
    return cacheDataString !== null ? true : false;
  }
  delete(key: string): void {
    localStorage.removeItem(key);
  }
}

export class SessionStorage implements Storage {
  type: StorageType;
  constructor() {
    this.type = StorageType.SESSION;
  }
  insert(key, value: RequestCacheObjectType): void {
    sessionStorage.setItem(key, JSON.stringify(value));
  }
  get(key): RequestCacheObjectType {
    return JSON.parse(sessionStorage.getItem(key));
  }
  exists(key: string): boolean {
    const cacheDataString = sessionStorage.getItem(key);
    return cacheDataString !== null ? true : false;
  }
  delete(key: string): void {
    sessionStorage.removeItem(key);
  }
}

export class InMemoryStorage implements Storage {
  type: StorageType;
  private inMemoryCache?: Record<string, RequestCacheObjectType>;

  constructor() {
    this.type = StorageType.IN_MEMORY;
    this.inMemoryCache = {};
  }
  insert(key: string, value: RequestCacheObjectType): void {
    this.inMemoryCache![key] = value;
  }
  get(key: string): RequestCacheObjectType {
    return this.inMemoryCache![key];
  }
  exists(key: string): boolean {
    return key in this.inMemoryCache!;
  }
  delete(key: string): void {
    delete this.inMemoryCache![key];
  }
}
