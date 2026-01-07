type Size = "small" | "medium" | "large";

let x: (string | number)[] = ["Doug", 4];

let myTuple: [string, string, number] = ["", "", Infinity];

console.log(x);

type MathFunction = (a: number, b: number) => number;

let add: MathFunction = (a, b) => {
  return a + b;
};

//                  ⬇ type parameter
let reverseArray = <T = number>(arr: T[]) => {
  return arr.reverse();
};

let numbers: number[] = [1, 2, 3, 4, 5, 6];

let reversed = reverseArray(numbers);

//  {highest: 6, lowest: 1}
type HighLow = { highest: number; lowest: number };
let results = numbers.reduce<HighLow>(
  (acc, cv) => {
    if (cv > acc.highest) acc.highest = cv;
    if (cv < acc.lowest) acc.lowest = cv;
    return acc;
  },
  {
    highest: -Infinity,
    lowest: Infinity,
  }
);

// Record === Object

const stuff: Record<string, number | string> = {
  a: 1,
  b: 4,
  c: "fun",
};

type Country = {
  name: string;
  capital: string;
  population: number;
};

const states = {
  CA: "California",
  FL: "Florida",
  OK: "Oklahoma",
};

type PostalCode = keyof typeof states;
// type PostalCode = "CA" | "FL" | "OK" | "HI";

const z: PostalCode = "OK";

type CountryKey = keyof Country;

let y: CountryKey = "capital";

// https://www.w3schools.com/typescript/typescript_quiz.php

/*
        <form onSu>

        </form>
*/

//  tsc
