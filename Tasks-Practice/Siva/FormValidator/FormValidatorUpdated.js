"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FormValidator = void 0;
var FormValidator = /** @class */ (function () {
    function FormValidator() {
        this.validatorObj = {};
        this.currentField = null;
    }
    FormValidator.prototype.field = function (fieldName) {
        var _a;
        this.currentField = fieldName;
        this.validatorObj[fieldName] = (_a = this.validatorObj[fieldName]) !== null && _a !== void 0 ? _a : [];
        return this;
    };
    FormValidator.prototype.required = function (message) {
        this.validatorObj[this.currentField].push({
            validate: function (value) { return Boolean(value); },
            message: message || "".concat(this.currentField, " not found in the form data"),
        });
        return this;
    };
    FormValidator.prototype.minLength = function (length, message) {
        this.validatorObj[this.currentField].push({
            validate: function (value) { return (value ? value.length > length : false); },
            message: message ||
                "".concat(this.currentField, " should have a minimum length of ").concat(length),
        });
        return this;
    };
    FormValidator.prototype.maxLength = function (length, message) {
        this.validatorObj[this.currentField].push({
            validate: function (value) { return (value ? value.length < length : false); },
            message: message ||
                "".concat(this.currentField, " should have a maximum length of ").concat(length),
        });
        return this;
    };
    FormValidator.prototype.pattern = function (regExp, message) {
        if (!(regExp instanceof RegExp))
            throw new Error("Expression passed is not an Regular Expression");
        this.validatorObj[this.currentField].push({
            validate: function (value) { return regExp.test(value); },
            message: message ||
                "".concat(this.currentField, " doesn't match with the Regular Expression pattern"),
        });
        return this;
    };
    FormValidator.prototype.custom = function (userfunction, message) {
        this.validatorObj[this.currentField].push({
            validate: userfunction,
            message: message || "Custom Validation failed for field - ".concat(this.currentField),
        });
        return this;
    };
    FormValidator.prototype.validate = function (formData) {
        var errors = {};
        var _loop_1 = function (fieldName, validations) {
            var evaluatedValue = this_1.getValue(fieldName, formData);
            if (evaluatedValue == undefined) {
                errors[fieldName] = [
                    "Error in the passed field - ".concat(fieldName, " does not exist"),
                ];
                return "continue";
            }
            var currErrors = validations.reduce(function (prev, curr) {
                if (!curr.validate(evaluatedValue))
                    return prev.concat(curr.message);
                return prev;
            }, []);
            if (currErrors.length > 0)
                errors[fieldName] = currErrors;
        };
        var this_1 = this;
        for (var _i = 0, _a = Object.entries(this.validatorObj); _i < _a.length; _i++) {
            var _b = _a[_i], fieldName = _b[0], validations = _b[1];
            _loop_1(fieldName, validations);
        }
        return errors;
    };
    FormValidator.prototype.getValue = function (path, formData) {
        if (formData === undefined)
            return formData;
        if (!path)
            return formData;
        var pattern = /(?:\["?)?(\w+)(?:\.|"?])?(.*)/i;
        var _a = path.match(pattern), property = _a[1], rest = _a[2];
        return this.getValue(rest, formData[property]);
    };
    return FormValidator;
}());
exports.FormValidator = FormValidator;
// const sampleData3 = {
//   username: "sprinklr",
//   email: "sprinklr.user@sprinklr.com",
//   password: "123456",
//   accessField: {
//     accessLevel: ["AA", "BB", "CC"],
//     accessState: [
//       {
//         signal: "right",
//         signalStrength: 2000,
//       },
//       {
//         signal: "right",
//         signalStrength: 2000,
//       },
//       {
//         signal: "right",
//         signalStrength: 2000,
//       },
//     ],
//   },
// };
// const formValidator = new FormValidator();
// console.log(
//   formValidator
//     .field("accessField.accessState[0].signal")
//     .minLength(70)
//     .maxLength(3)
//     .validate(sampleData3)
// );
// TODOS:
// 1. custom validation => FormValidator().custom((fieldValue: T,formdata: FormDataType) => boolean, errorMessage?:string )
// 2. nested field => FormValidator().required(user.firstName)
// 3. handle arrays
