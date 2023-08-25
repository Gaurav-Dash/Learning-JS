"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InMemoryStorage = exports.SessionStorage = exports.LocalStorage = void 0;
var HttpClientTypes_1 = require("./HttpClientTypes");
var LocalStorage = /** @class */ (function () {
    function LocalStorage() {
        this.type = HttpClientTypes_1.StorageType.LOCAL;
    }
    LocalStorage.prototype.insert = function (key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    };
    LocalStorage.prototype.get = function (key) {
        return JSON.parse(localStorage.getItem(key)); ////// check
    };
    LocalStorage.prototype.exists = function (key) {
        var cacheDataString = localStorage.getItem(key);
        return cacheDataString !== null ? true : false;
    };
    LocalStorage.prototype.delete = function (key) {
        localStorage.removeItem(key);
    };
    return LocalStorage;
}());
exports.LocalStorage = LocalStorage;
var SessionStorage = /** @class */ (function () {
    function SessionStorage() {
        this.type = HttpClientTypes_1.StorageType.SESSION;
    }
    SessionStorage.prototype.insert = function (key, value) {
        sessionStorage.setItem(key, JSON.stringify(value));
    };
    SessionStorage.prototype.get = function (key) {
        return JSON.parse(sessionStorage.getItem(key));
    };
    SessionStorage.prototype.exists = function (key) {
        var cacheDataString = sessionStorage.getItem(key);
        return cacheDataString !== null ? true : false;
    };
    SessionStorage.prototype.delete = function (key) {
        sessionStorage.removeItem(key);
    };
    return SessionStorage;
}());
exports.SessionStorage = SessionStorage;
var InMemoryStorage = /** @class */ (function () {
    function InMemoryStorage() {
        this.type = HttpClientTypes_1.StorageType.IN_MEMORY;
        this.inMemoryCache = {};
    }
    InMemoryStorage.prototype.insert = function (key, value) {
        this.inMemoryCache[key] = value;
    };
    InMemoryStorage.prototype.get = function (key) {
        return this.inMemoryCache[key];
    };
    InMemoryStorage.prototype.exists = function (key) {
        return key in this.inMemoryCache;
    };
    InMemoryStorage.prototype.delete = function (key) {
        delete this.inMemoryCache[key];
    };
    return InMemoryStorage;
}());
exports.InMemoryStorage = InMemoryStorage;
