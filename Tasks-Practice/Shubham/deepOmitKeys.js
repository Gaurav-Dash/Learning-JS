"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deepOmitKeys = void 0;
function deepOmitKeys(obj, keys) {
    if (typeof obj !== "object" && !Array.isArray(obj))
        return obj;
    var clonedObject = Array.isArray(obj) ? [] : {};
    var changeFound = false;
    for (var key in obj) {
        if (keys.includes(key)) {
            changeFound = true;
            continue;
        }
        if (typeof obj[key] == "object") {
            clonedObject[key] = deepOmitKeys(obj[key], keys);
        }
        else {
            clonedObject[key] = obj[key];
        }
        changeFound = changeFound || clonedObject[key] !== obj[key];
    }
    return changeFound ? clonedObject : obj;
}
exports.deepOmitKeys = deepOmitKeys;
var input1 = ["a"];
var input2 = { a: 1, b: null };
var input = {
    a: 1,
    c: {
        a: [1, 2],
        b: [
            { a: 1, x: 2, y: 3 },
            { a: 2, x: 20, y: 30 },
        ],
    },
    d: {
        b: [
            { a: 1, x: 2, y: 3 },
            { x: 20, y: 30 },
        ],
    },
};
console.log(deepOmitKeys(input2, ["a"]));
