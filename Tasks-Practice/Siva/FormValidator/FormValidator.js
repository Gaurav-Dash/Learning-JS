"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FormValidator = void 0;
var FormValidator = /** @class */ (function () {
    function FormValidator() {
        this.errors = {};
        this.validatorObj = {};
        this.currentField = null;
    }
    FormValidator.prototype.field = function (fieldName) {
        this.currentField = fieldName;
        this.validatorObj[fieldName] = {
            required: null,
            maxLength: null,
            minLength: null,
            pattern: null,
            custom: null,
            isNested: fieldName.includes(".") || fieldName.includes("["),
        };
        return this;
    };
    FormValidator.prototype.required = function (message) {
        this.validatorObj[this.currentField].required = {
            value: true,
            message: message,
        };
        return this;
    };
    FormValidator.prototype.minLength = function (length, message) {
        this.validatorObj[this.currentField].minLength = {
            value: length,
            message: message,
        };
        return this;
    };
    FormValidator.prototype.maxLength = function (length, message) {
        this.validatorObj[this.currentField].maxLength = {
            value: length,
            message: message,
        };
        return this;
    };
    FormValidator.prototype.pattern = function (regExp, message) {
        this.validatorObj[this.currentField].pattern = {
            value: regExp,
            message: message,
        };
        return this;
    };
    FormValidator.prototype.custom = function (userfunction, message) {
        this.validatorObj[this.currentField].custom = {
            value: userfunction,
            message: message,
        };
        return this;
    };
    FormValidator.prototype.validate = function (formData) {
        var _a;
        for (var fieldName in this.validatorObj) {
            var fieldValue = "", error = void 0;
            if (this.validatorObj[fieldName].isNested) {
                _a = this.getNestedObjAndValue(fieldName, formData), error = _a[0], fieldValue = _a[1];
                if (error && error.length > 0) {
                    this.addError(fieldName, null, error);
                    continue;
                }
            }
            if (fieldValue == "")
                fieldValue = formData[fieldName];
            if (this.handleRequiredFieldCheck(fieldName, fieldValue))
                continue;
            this.handleLengthCheck("min", fieldName, fieldValue);
            this.handleLengthCheck("max", fieldName, fieldValue);
            this.handleRegExCheck(fieldName, fieldValue);
            this.handleCustomFunctionCheck(fieldName, fieldValue);
        }
        return this.errors;
    };
    FormValidator.prototype.getNestedObjAndValue = function (fieldName, formData) {
        var fields = fieldName.split(".");
        var error;
        var lastFieldName = fields.pop();
        var currFormData = formData;
        for (var _i = 0, fields_1 = fields; _i < fields_1.length; _i++) {
            var field = fields_1[_i];
            console.log(field);
            if (this.checkFieldIsArrayKey(field)) {
                console.log("hereer", field);
                var fieldName_1 = field.split("[")[0];
                var index = field.split("[")[1];
                index = index.slice(0, -1);
                index = Number.parseInt(index);
                if (fieldName_1 in currFormData &&
                    Array.isArray(currFormData[fieldName_1]) &&
                    index < currFormData[fieldName_1].length) {
                    currFormData = currFormData[fieldName_1][index];
                }
                else {
                    error = "".concat(fieldName_1, " - with index ").concat(index, " field not found");
                    break;
                }
            }
            else if (field in currFormData) {
                currFormData = currFormData[field];
            }
            else {
                error = "".concat(field, " field not found");
                break;
            }
        }
        var fieldValue = "";
        console.log(currFormData);
        if (this.checkFieldIsArrayKey(lastFieldName)) {
            var fieldName_2 = lastFieldName.split("[")[0];
            var index = lastFieldName.split("[")[1];
            index = index.slice(0, -1);
            index = Number.parseInt(index);
            if (fieldName_2 in currFormData &&
                Array.isArray(currFormData[fieldName_2]) &&
                index < currFormData[fieldName_2].length) {
                fieldValue = currFormData[fieldName_2][index];
            }
            else {
                error = "".concat(fieldName_2, " - with index ").concat(index, " field not found");
            }
        }
        else if (currFormData[lastFieldName]) {
            fieldValue = currFormData[lastFieldName];
        }
        else if (!error) {
            error = "".concat(lastFieldName, " field not found");
        }
        return [error, fieldValue];
    };
    FormValidator.prototype.checkFieldIsArrayKey = function (fieldName) {
        var pattern = new RegExp("\\[([0-9]*?)\\]");
        return pattern.test(fieldName);
    };
    FormValidator.prototype.handleRequiredFieldCheck = function (fieldName, fieldValue) {
        if (this.validatorObj[fieldName].required) {
            if (!fieldValue) {
                this.addError(fieldName, this.validatorObj[fieldName].required.message, "".concat(fieldName, " not found in the form data"));
                return true;
            }
        }
        return false;
    };
    FormValidator.prototype.handleLengthCheck = function (checkType, fieldName, fieldValue) {
        if (!this.checkIfFieldPresent(fieldName, "".concat(checkType, "Length")))
            return;
        switch (checkType) {
            case "min":
                fieldValue.length <
                    this.validatorObj[fieldName].minLength.value
                    ? this.addError(fieldName, this.validatorObj[fieldName].minLength.message, "".concat(fieldName, " should have a minimum length of ").concat(this.validatorObj[fieldName].minLength.value))
                    : null;
                break;
            case "max":
                fieldValue.length >
                    this.validatorObj[fieldName].maxLength.value
                    ? this.addError(fieldName, this.validatorObj[fieldName].maxLength.message, "".concat(fieldName, " should have a maximum length of ").concat(this.validatorObj[fieldName].maxLength.value))
                    : null;
                break;
        }
    };
    FormValidator.prototype.handleRegExCheck = function (fieldName, fieldValue) {
        if (!this.checkIfFieldPresent(fieldName, "pattern"))
            return;
        var regEx = new RegExp(this.validatorObj[fieldName].pattern.value);
        if (!regEx.test(fieldValue))
            this.addError(fieldName, this.validatorObj[fieldName].pattern.message, "Regular Expression value not matching");
    };
    FormValidator.prototype.handleCustomFunctionCheck = function (fieldName, fieldValue) {
        if (!this.checkIfFieldPresent(fieldName, "custom"))
            return;
        if (!this.validatorObj[fieldName].custom.value(fieldValue))
            this.addError(fieldName, this.validatorObj[fieldName].custom.message, "Custom Validation failed");
    };
    FormValidator.prototype.checkIfFieldPresent = function (fieldName, validationType) {
        return Boolean(this.validatorObj[fieldName][validationType]);
    };
    FormValidator.prototype.addError = function (fieldName, msg, defaultMsg) {
        if (fieldName in this.errors)
            this.errors[fieldName].push(msg || defaultMsg);
        else
            this.errors[fieldName] = [msg || defaultMsg];
    };
    return FormValidator;
}());
exports.FormValidator = FormValidator;
var sampleData3 = {
    username: "sprinklr",
    email: "sprinklr.user@sprinklr.com",
    password: "123456",
    accessField: {
        accessLevel: ["AA", "BB", "CC"],
        accessState: [
            {
                signal: "right",
                signalStrength: 2000,
            },
            {
                signal: "right",
                signalStrength: 2000,
            },
            {
                signal: "right",
                signalStrength: 2000,
            },
        ],
    },
};
var formValidator = new FormValidator();
console.log(formValidator
    .field("accessField.accessState[0].signal")
    .minLength(70)
    .validate(sampleData3));
// TODOS:
// 1. custom validation => FormValidator().custom((fieldValue: T,formdata: FormDataType) => boolean, errorMessage?:string )
// 2. nested field => FormValidator().required(user.firstName)
// 3. handle arrays
