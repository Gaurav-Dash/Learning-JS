import {
  ErrorType,
  CustomFunction,
  ValidatorObjType,
  FieldValueType,
  FormDataType,
} from "./FormValidatorTypes";

export class FormValidator {
  private errors: ErrorType;
  private validatorObj: ValidatorObjType;
  private currentField: string | null;

  constructor() {
    this.errors = {};
    this.validatorObj = {};
    this.currentField = null;
  }

  field(fieldName: string) {
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
  }

  required(message?: string) {
    this.validatorObj[this.currentField].required = {
      value: true,
      message: message,
    };
    return this;
  }

  minLength(length: number, message?: string) {
    this.validatorObj[this.currentField].minLength = {
      value: length,
      message: message,
    };
    return this;
  }

  maxLength(length: number, message?: string) {
    this.validatorObj[this.currentField].maxLength = {
      value: length,
      message: message,
    };
    return this;
  }

  pattern(regExp, message?: string) {
    this.validatorObj[this.currentField].pattern = {
      value: regExp,
      message: message,
    };
    return this;
  }

  custom(userfunction: (fieldValue: string) => boolean, message?: string) {
    this.validatorObj[this.currentField].custom = {
      value: userfunction,
      message: message,
    };
    return this;
  }

  validate(formData: FormDataType) {
    for (const fieldName in this.validatorObj) {
      let fieldValue: FieldValueType = "",
        error: string;
      if (this.validatorObj[fieldName].isNested) {
        [error, fieldValue] = this.getNestedObjAndValue(fieldName, formData);
        if (error && error.length > 0) {
          this.addError(fieldName, null, error);
          continue;
        }
      }

      if (fieldValue == "") fieldValue = formData[fieldName] as FieldValueType;

      if (this.handleRequiredFieldCheck(fieldName, fieldValue)) continue;
      this.handleLengthCheck("min", fieldName, fieldValue as FieldValueType);
      this.handleLengthCheck("max", fieldName, fieldValue as FieldValueType);
      this.handleRegExCheck(fieldName, fieldValue as FieldValueType);
      this.handleCustomFunctionCheck(fieldName, fieldValue as FieldValueType);
    }
    return this.errors;
  }

  private getNestedObjAndValue(
    fieldName: string,
    formData: FormDataType
  ): [error: string, fieldValue: FieldValueType] {
    const fields = fieldName.split(".");
    let error: string;
    const lastFieldName = fields.pop();
    let currFormData = formData;

    for (const field of fields) {
      console.log(field);
      if (this.checkFieldIsArrayKey(field)) {
        console.log("hereer", field);
        const fieldName = field.split("[")[0];
        let index: number | string = field.split("[")[1];
        index = index.slice(0, -1);
        index = Number.parseInt(index);

        if (
          fieldName in currFormData &&
          Array.isArray(currFormData[fieldName]) &&
          index < (currFormData[fieldName] as FieldValueType[]).length
        ) {
          currFormData = currFormData[fieldName][index] as FormDataType;
        } else {
          error = `${fieldName} - with index ${index} field not found`;
          break;
        }
      } else if (field in currFormData) {
        currFormData = currFormData[field] as FormDataType;
      } else {
        error = `${field} field not found`;
        break;
      }
    }

    let fieldValue: FieldValueType = "";

    console.log(currFormData);

    if (this.checkFieldIsArrayKey(lastFieldName)) {
      const fieldName = lastFieldName.split("[")[0];
      let index: number | string = lastFieldName.split("[")[1];
      index = index.slice(0, -1);
      index = Number.parseInt(index);
      if (
        fieldName in currFormData &&
        Array.isArray(currFormData[fieldName]) &&
        index < (currFormData[fieldName] as FieldValueType[]).length
      ) {
        fieldValue = currFormData[fieldName][index] as FieldValueType;
      } else {
        error = `${fieldName} - with index ${index} field not found`;
      }
    } else if (currFormData[lastFieldName]) {
      fieldValue = currFormData[lastFieldName] as FieldValueType;
    } else if (!error) {
      error = `${lastFieldName} field not found`;
    }
    return [error, fieldValue];
  }

  private checkFieldIsArrayKey(fieldName: string): boolean {
    const pattern = new RegExp("\\[([0-9]*?)\\]");
    return pattern.test(fieldName);
  }

  private handleRequiredFieldCheck(
    fieldName: string,
    fieldValue: number | string | boolean | null
  ): boolean {
    if (this.validatorObj[fieldName].required) {
      if (!fieldValue) {
        this.addError(
          fieldName,
          this.validatorObj[fieldName].required!.message,
          `${fieldName} not found in the form data`
        );
        return true;
      }
    }
    return false;
  }

  private handleLengthCheck(
    checkType: "min" | "max",
    fieldName: string,
    fieldValue: number | string | boolean | null
  ) {
    if (!this.checkIfFieldPresent(fieldName, `${checkType}Length`)) return;
    switch (checkType) {
      case "min":
        (fieldValue as string).length <
        (this.validatorObj[fieldName].minLength!.value as number)
          ? this.addError(
              fieldName,
              this.validatorObj[fieldName].minLength!.message,
              `${fieldName} should have a minimum length of ${this.validatorObj[fieldName].minLength.value}`
            )
          : null;
        break;
      case "max":
        (fieldValue as string).length >
        (this.validatorObj[fieldName].maxLength!.value as number)
          ? this.addError(
              fieldName,
              this.validatorObj[fieldName].maxLength!.message,
              `${fieldName} should have a maximum length of ${this.validatorObj[fieldName].maxLength.value}`
            )
          : null;
        break;
    }
  }

  private handleRegExCheck(
    fieldName: string,
    fieldValue: number | string | boolean | null
  ) {
    if (!this.checkIfFieldPresent(fieldName, "pattern")) return;
    const regEx = new RegExp(
      this.validatorObj[fieldName].pattern.value as RegExp
    );
    if (!regEx.test(fieldValue as string))
      this.addError(
        fieldName,
        this.validatorObj[fieldName].pattern!.message,
        `Regular Expression value not matching`
      );
  }

  private handleCustomFunctionCheck(
    fieldName: string,
    fieldValue: number | string | boolean | null
  ) {
    if (!this.checkIfFieldPresent(fieldName, "custom")) return;

    if (
      !(this.validatorObj[fieldName].custom.value as CustomFunction)(
        fieldValue as FieldValueType
      )
    )
      this.addError(
        fieldName,
        this.validatorObj[fieldName].custom!.message,
        `Custom Validation failed`
      );
  }

  private checkIfFieldPresent(
    fieldName: string,
    validationType:
      | "required"
      | "minLength"
      | "maxLength"
      | "pattern"
      | "custom"
  ): boolean {
    return Boolean(this.validatorObj[fieldName][validationType]);
  }

  private addError(fieldName: string, msg: string, defaultMsg: string) {
    if (fieldName in this.errors)
      this.errors[fieldName].push(msg || defaultMsg);
    else this.errors[fieldName] = [msg || defaultMsg];
  }
}

const sampleData3 = {
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

const formValidator = new FormValidator();

console.log(
  formValidator
    .field("accessField.accessState[0].signal")
    .minLength(70)
    .validate(sampleData3)
);

// TODOS:
// 1. custom validation => FormValidator().custom((fieldValue: T,formdata: FormDataType) => boolean, errorMessage?:string )
// 2. nested field => FormValidator().required(user.firstName)
// 3. handle arrays
