// import React, { Component } from 'react';

class Test {
  constructor() {
    this.state = {
      name: '',
    };
  }
  render() {
    return 'hi';
  }
}

console.log('LOOK HERE', Test);
console.log('LOOK HERE2', Test.prototype);
console.log('3', Test.prototype.render);

// let classTest = new Test();
// const stringTest = JSON.stringify(classTest);
// console.log('test1', stringTest);

// const obj = { 1: true, 2: false };
// const stringTest2 = JSON.stringify(obj);
// console.log('test2', stringTest2);
// console.log(typeof stringTest2);
// console.log('obj', obj);

// function hookify(classComponent) {
//   return function test() {
//     return <div></div>;
//   };
// }
