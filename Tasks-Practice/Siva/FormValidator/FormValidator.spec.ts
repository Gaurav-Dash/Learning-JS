import { FormDataType } from "./FormValidatorTypesUpdated";
import { FormValidator } from "./FormValidatorUpdated";

describe("Form Validator testing suite", () => {
  const sampleData1 = {
    username: "",
    email: "gaurav.dash#sprinklr.com",
    password: "somedeepsecret",
  };

  const sampleData2 = {
    username: "gaurav_123",
    password: "somedeepsecret",
  };

  const sampleData3 = {
    username: "sprinklr",
    email: "sprinklr.user@sprinklr.com",
    password: "1234567",
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

  const sampleData4: FormDataType = {
    name: {
      firstName: "Gaurav",
      lastName: "Dash",
    },
    address: {
      city: "Balasore",
      state: "Odisha",
      phone: {
        mobile: "123456",
        telephone: "9987651",
      },
    },
  };

  const sampleData5 = {
    username: "",
    email: "gaurav.dash#sprinklr.com",
    password: "somedeepsecret",
  };

  test("Case 1 - Username (req)", () => {
    const formValidator = new FormValidator();
    expect(
      formValidator
        .field("username")
        .required("Username is required")
        .validate(sampleData1)
    ).toEqual({ username: ["Username is required"] });
  });

  test("Case 2 - Password (min-length)", () => {
    const formValidator = new FormValidator();
    expect(
      formValidator
        .field("password")
        .required("Password is required")
        .minLength(15, "password should have a minimum length of 15")
        .validate(sampleData1)
    ).toEqual({ password: ["password should have a minimum length of 15"] });
  });

  test("Case 3 - Password (max-length)", () => {
    const formValidator = new FormValidator();
    expect(
      formValidator
        .field("password")
        .required("Password is required")
        .maxLength(10, "password should not be greater than length of 10")
        .validate(sampleData1)
    ).toEqual({
      password: ["password should not be greater than length of 10"],
    });
  });

  test("Case 4 - Email (regex)", () => {
    const formValidator = new FormValidator();
    expect(
      formValidator
        .field("email")
        .required("Email is required")
        .pattern(
          /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/i,
          "Invalid email format"
        )
        .validate(sampleData1)
    ).toEqual({
      email: ["Invalid email format"],
    });
  });

  test("Case 5 - Check the Contradiction", () => {
    const formValidator = new FormValidator();
    expect(
      formValidator
        .field("email")
        .required("Email is required")
        .pattern(
          /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/i,
          "Invalid email format"
        )
        .validate(sampleData2)
    ).toEqual({
      email: ["Error in the passed field - email does not exist"],
    });
  });

  test("Case 6 - Default message", () => {
    const formValidator = new FormValidator();
    expect(
      formValidator.field("email").required().validate(sampleData2)
    ).toEqual({
      email: ["Error in the passed field - email does not exist"],
    });
  });

  test("Case 7 - Default message in aggregated errors", () => {
    const formValidator = new FormValidator();
    expect(
      formValidator
        .field("username")
        .pattern(/^[0-9]*$/)
        .minLength(20, "Should have a minimum length of 4")
        .validate(sampleData2)
    ).toEqual({
      username: [
        "username doesn't match with the Regular Expression pattern",
        "Should have a minimum length of 4",
      ],
    });
  });

  test("Case 8 - Expect no errors", () => {
    const formValidator = new FormValidator();
    expect(
      formValidator
        .field("username")
        .required("Username is required.")
        .minLength(5, "Username should have at least 5 characters.")
        .maxLength(25, "Username should have at max 25 charecters")
        .field("email")
        .required("Email is required.")
        .pattern(
          // eslint-disable-next-line no-useless-escape
          /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
          "Invalid email format."
        )
        .field("password")
        .required("Password is required.")
        .minLength(6, "Password should have at least 6 characters.")
        .validate(sampleData3)
    ).toEqual({});
  });

  test("Case 9 - Custom Function validation", () => {
    const formValidator = new FormValidator();

    expect(
      formValidator
        .field("username")
        .custom(
          (value) => value[0] === value[0].toUpperCase(),
          "First letter of username should be uppercase"
        )
        .field("password")
        .custom((value) => !/\d/.test(value))
        .field("email")
        .custom(
          (value) => value.length > 5,
          "email should be of a minimum length 5"
        )
        .validate(sampleData3)
    ).toEqual({
      username: ["First letter of username should be uppercase"],
      password: ["Custom Validation failed for field - password"],
    });
  });

  test("Case 10 - Nested Formdata validation", () => {
    const formValidator = new FormValidator();
    expect(
      formValidator
        .field("name.firstName")
        .minLength(20, "minimum length should be 20")
        .field("address.phone.mobile")
        .maxLength(5)
        .validate(sampleData4)
    ).toEqual({
      "address.phone.mobile": [
        "address.phone.mobile should have a maximum length of 5",
      ],
      "name.firstName": ["minimum length should be 20"],
    });
  });

  test("Case 11 - Nested Formdata Field Missing", () => {
    const formValidator = new FormValidator();
    expect(
      formValidator
        .field("name.middlename")
        .minLength(20, "minimum length should be 20")
        .field("address.country.code")
        .maxLength(5)
        .validate(sampleData4)
    ).toEqual({
      "address.country.code": [
        "Error in the passed field - address.country.code does not exist",
      ],
      "name.middlename": [
        "Error in the passed field - name.middlename does not exist",
      ],
    });
  });

  test("Case 12 - Array formdata validation (Out of Bound)", () => {
    const formValidator = new FormValidator();
    expect(
      formValidator
        .field("accessField.accessState[9].signal")
        .minLength(70)
        .validate(sampleData3)
    ).toEqual({
      "accessField.accessState[9].signal": [
        "Error in the passed field - accessField.accessState[9].signal does not exist",
      ],
    });
  });

  test("Case 13 - Array formdata Validation (inside an array)", () => {
    const formValidator = new FormValidator();
    expect(
      formValidator
        .field("accessField.accessLevel[0]")
        .minLength(10)
        .validate(sampleData3)
    ).toEqual({
      "accessField.accessLevel[0]": [
        "accessField.accessLevel[0] should have a minimum length of 10",
      ],
    });
  });

  test("Case 14 - Array formdata Validation (inside nested array)", () => {
    const formValidator = new FormValidator();
    expect(
      formValidator
        .field("accessField.accessState[0].signal")
        .minLength(10)
        .field("accessField.accessLevel[23]")
        .validate(sampleData3)
    ).toEqual({
      "accessField.accessLevel[23]": [
        "Error in the passed field - accessField.accessLevel[23] does not exist",
      ],
      "accessField.accessState[0].signal": [
        "accessField.accessState[0].signal should have a minimum length of 10",
      ],
    });
  });

  test("Case 15 - No Validations", () => {
    const formValidator = new FormValidator();
    expect(
      formValidator
        .field("username")
        .minLength(2)
        .maxLength(20)
        .validate(sampleData5)
    ).toEqual({
      username: [
        "username should have a minimum length of 2",
        "username should have a maximum length of 20",
      ],
    });
  });
});
