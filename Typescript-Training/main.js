"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mssg = "Some Message here";
console.log(mssg);
var add = function (num1, num2) { return num1 + num2; };
var printUserDetails = function (usr) {
    console.log("".concat(usr.firstName, " ").concat(usr.lastname, " ").concat(usr.age));
};
var user = {
    firstName: "Gaurav",
    lastname: "Dash",
    age: 22,
};
printUserDetails(user);
