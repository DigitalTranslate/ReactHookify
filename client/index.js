import React from 'react';
import ReactDOM from 'react-dom';
import App from './app';
console.log('proto', App.prototype);
// console.log('componentDidMount', App.prototype.componentDidMount);
console.log(App.prototype.render);
// console.log(App.prototype.render());
// console.log('look here', App.prototype.render.toString());
// console.log(App.prototype.constructor);

// console.log(App.prototype.componentDidMount);

class Test {
  constructor() {
    this.state = { name: 'bob' };
  }
  componentDidMount() {
    return 'hi';
  }

  render() {
    return <div>hi</div>;
  }
}
console.log(Test.render);
// console.log(Test.prototype.render.toString());
// console.log(Test.prototype.constructor.toString());

ReactDOM.render(<App />, document.getElementById('app'));
