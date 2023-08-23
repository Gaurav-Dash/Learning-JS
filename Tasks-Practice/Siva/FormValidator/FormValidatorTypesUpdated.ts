export type ErrorType = Record<string, string[]>;

export type FieldType = {
  validate: (value: string) => boolean;
  message: string;
};

export type ValidatorObjType = {
  [fieldName: string]: Array<FieldType>;
};

export type FieldValueType = number | boolean | string | Array<FieldValueType>;

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
      [1, 2, [2, 3], "a"],
      { f: [2, 1, ""], g: "some string" },
    ],
  },
};

console.log(obj);
