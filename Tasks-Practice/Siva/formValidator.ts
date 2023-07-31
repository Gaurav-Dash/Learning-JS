// implement class

type ErrorType = {
  [fieldName: string]: string[];
};

type FieldType = {
  value: number | boolean | string | RegExp;
  message: string | number;
} | null;

type validatorObjType = {
  [fieldname: string]: {
    required: FieldType;
    maxLength: FieldType;
    minLength: FieldType;
    pattern: FieldType;
  };
};

class FormValidator {
  errors: ErrorType;
  validatorObj: validatorObjType;
  currentField: string | null;
  constructor() {
    this.errors = {};
    this.validatorObj = {};
    this.currentField = null;
  }
  field(fieldName) {
    this.currentField = fieldName;
    this.validatorObj[fieldName] = {
      required: null,
      maxLength: null,
      minLength: null,
      pattern: null,
    };
    return this;
  }

  required(message) {
    this.validatorObj[this.currentField as string].required = {
      value: true,
      message: message,
    };
    return this;
  }

  minLength(length, message) {
    this.validatorObj[this.currentField as string].minLength = {
      value: length,
      message: message,
    };
    return this;
  }

  maxLength(length, message) {
    this.validatorObj[this.currentField as string].maxLength = {
      value: length,
      message: message,
    };
    return this;
  }

  pattern(regExp, message) {
    this.validatorObj[this.currentField as string].pattern = {
      value: regExp,
      message: message,
    };
    return this;
  }

  validate(formData) {
    for (let fieldname in this.validatorObj) {
      if (this.validatorObj[fieldname].required) {
        if (!(fieldname in formData)) {
          this.addError(
            fieldname,
            this.validatorObj[fieldname].required?.message,
            `${fieldname} not found in the form data`
          );
          continue;
        } else if (["", null, undefined].includes(formData[fieldname])) {
          this.addError(
            fieldname,
            this.validatorObj[fieldname].required?.message,
            `${fieldname} cannot be ${formData[fieldname]}`
          );
          continue;
        }
      }
      if (this.validatorObj[fieldname].minLength) {
        if (
          formData[fieldname].length <
          this.validatorObj[fieldname].minLength!.value
        )
          this.addError(
            fieldname,
            this.validatorObj[fieldname].minLength!.message,
            `${fieldname} should have a minimum length of ${this.validatorObj[fieldname].minLength}`
          );
      }
      if (this.validatorObj[fieldname].maxLength) {
        if (
          formData[fieldname].length >
          this.validatorObj[fieldname].maxLength!.value
        )
          this.addError(
            fieldname,
            this.validatorObj[fieldname].maxLength!.message,
            `${fieldname} should have a maximum length of ${this.validatorObj[fieldname].minLength}`
          );
      }

      if (this.validatorObj[fieldname].pattern) {
        if (
          !(this.validatorObj[fieldname].pattern!.value as RegExp).test(
            formData[fieldname]
          )
        )
          this.addError(
            fieldname,
            this.validatorObj[fieldname].pattern!.message,
            `Regular Expression value not matching`
          );
      }
    }

    return this.errors;
  }

  addError(fieldname, msg, defaultMsg) {
    if (fieldname in this.errors)
      this.errors[fieldname].push(msg || defaultMsg);
    else this.errors[fieldname] = [msg || defaultMsg];
  }
}

// Usage example
const formData = {
  username: "sprinklr",
  email: "sprinklr.user@sprinklr.com",
  // password: "123456",
};

const formValidator = new FormValidator();

const errors = formValidator
  .field("username")
  .required("Username is required.")
  .minLength(20, "Username should have at least 5 characters.")
  .field("email")
  .required("Email is required.")
  .pattern(
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/i,
    "Invalid email format."
  )
  .field("password")
  .required("Password is required.")
  .minLength(6, "Password should have at least 6 characters.")
  .validate(formData);

// const oneError = formValidator
//   .field("username")
//   .required("Username is required.")
//   .minLength(20, "Username should have at least 5 characters.")
//   .validate(formData);

console.log(errors);
// console.log(oneError);
