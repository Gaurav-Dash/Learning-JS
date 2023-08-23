import {
  ErrorType,
  ValidatorObjType,
  FormDataType,
} from "./FormValidatorTypesUpdated";

export class FormValidator {
  private validatorObj: ValidatorObjType;
  private currentField: string | null;

  constructor() {
    this.validatorObj = {};
    this.currentField = null;
  }

  field(fieldName: string) {
    this.currentField = fieldName;
    this.validatorObj[fieldName] = this.validatorObj[fieldName] ?? [];
    return this;
  }

  required(message?: string) {
    this.validatorObj[this.currentField].push({
      validate: (value) => Boolean(value),
      message: message || `${this.currentField} not found in the form data`,
    });
    return this;
  }

  minLength(length: number, message?: string) {
    this.validatorObj[this.currentField].push({
      validate: (value: string) => (value ? value.length > length : false),
      message:
        message ||
        `${this.currentField} should have a minimum length of ${length}`,
    });
    return this;
  }

  maxLength(length: number, message?: string) {
    this.validatorObj[this.currentField].push({
      validate: (value: string) => (value ? value.length < length : false),
      message:
        message ||
        `${this.currentField} should have a maximum length of ${length}`,
    });
    return this;
  }

  pattern(regExp: RegExp, message?: string) {
    if (!(regExp instanceof RegExp))
      throw new Error("Expression passed is not an Regular Expression");
    this.validatorObj[this.currentField].push({
      validate: (value: string) => regExp.test(value),
      message:
        message ||
        `${this.currentField} doesn't match with the Regular Expression pattern`,
    });
    return this;
  }

  custom(userfunction: (fieldValue: string) => boolean, message?: string) {
    this.validatorObj[this.currentField].push({
      validate: userfunction,
      message:
        message || `Custom Validation failed for field - ${this.currentField}`,
    });
    return this;
  }

  validate(formData: FormDataType) {
    const errors: ErrorType = {};
    for (const [fieldName, validations] of Object.entries(this.validatorObj)) {
      const evaluatedValue = this.getValue(fieldName, formData);

      if (evaluatedValue == undefined) {
        errors[fieldName] = [
          `Error in the passed field - ${fieldName} does not exist`,
        ];
        continue;
      }

      const currErrors = validations.reduce((prev, curr) => {
        if (!curr.validate(evaluatedValue)) return prev.concat(curr.message);
        return prev;
      }, []);

      if (currErrors.length > 0) errors[fieldName] = currErrors;
    }
    return errors;
  }

  private getValue(path, formData) {
    if (formData === undefined) return formData;
    if (!path) return formData;

    const pattern = /(?:\["?)?(\w+)(?:\.|"?])?(.*)/i;

    const [, property, rest] = path.match(pattern);
    return this.getValue(rest, formData[property]);
  }
}

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
