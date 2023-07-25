export {};
let mssg = "Some Message here";
console.log(mssg);

const add = (num1: number, num2: number) => num1 + num2;

interface UserOptions {
  firstName: string;
  lastname: string;
  age: number;
}

const printUserDetails = (usr: UserOptions) => {
  console.log(`${usr.firstName} ${usr.lastname} ${usr.age}`);
};

let user: UserOptions = {
  firstName: "Gaurav",
  lastname: "Dash",
  age: 22,
};

printUserDetails(user);
