// function round(n?: number | string): number {
//   if (n === undefined) return 0;

//   if (typeof n === "string") n = Number(n);

//   return Math.round(n);
// }

let stuff = [0, 2, 3, false, null];

let myThing = stuff.find((x) => {
  return x === 3;
});

/*
    Array.prototype.find        -> ArrayType | undefined
    Array.prototype.findIndex   -> number | -1
*/

const users = [
  { name: "Julia", age: 25, isMature: false },
  { name: "James", age: 35, isMature: false },
];

// users.forEach(function (user, index) {
//   user.isMature = user.age >= 18;
//   console.log(user);
// }); // map over all elements but does not return new array; useful to use when modifying original array
// const usersNew = users.map((user) => {
//   return { ...user, isMature: user.age >= 18 };
//   //console.log(user, arr, index);
// }); // maps over all lements and return new array. does not mutate by itself

const usersAge = users.reduce((acc, user) => {
  return acc + user.age;
}, 0);

console.log(usersAge);
