export type RequestCacheObjectType = {
  cachedResult: unknown;
  insertedAt: number;
};

export type HttpClientArgType = {
  useCache: boolean;
  ttl?: number;
  cacheStorageType?: StorageType;
};

export enum StorageType {
  LOCAL = "local",
  SESSION = "session",
  IN_MEMORY = "inmemory",
}
