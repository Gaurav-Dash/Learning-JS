"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var obj = {
    a: 1,
    b: 2,
    e: [1, 2],
    c: {
        d: 1,
        e: [
            {
                a: 1,
            },
            "a",
            123,
            [1, 2, [2, 3], "a"],
            { f: [2, 1, ""], g: "some string" },
        ],
    },
};
console.log(obj);
