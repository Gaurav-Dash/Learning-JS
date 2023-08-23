export type ErrorType = Record<string, string[]>;

export type CustomFunction = {
  (fieldname: FieldValueType): boolean;
};

export type FieldType = {
  value: FieldValueType | RegExp | CustomFunction;
  message?: string; // optional propery
};

export type ValidatorObjType = {
  [fieldName: string]: {
    required?: FieldType;
    maxLength?: FieldType;
    minLength?: FieldType;
    pattern?: FieldType;
    custom?: FieldType;
    isNested?: boolean;
  };
};

export type FieldValueType = number | boolean | string;

// fix this - fixed
export type FormDataType = {
  [fieldname: string]:
    | Array<FieldValueType | FormDataType>
    | FieldValueType
    | FormDataType;
};

const obj: FormDataType = {
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
      // [1, 2],
    ],
  },
};

console.log(obj);
