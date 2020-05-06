const fs = require('fs');

fs.readFile('./client/test2.js', 'utf8', (err, data) => {
  if (err) {
    console.log('HI');
    console.error(err);
    return;
  }
  return data;
});

let dataArray = `import React from 'react';

    class Counter extends React.Component {
    constructor() {
      super();
      this.state = {
        counter: 0,
      };
      this.handleIncrement = this.handleIncrement.bind(this);
    }
  
    handleIncrement() {
      this.setState({
        counter: (this.state.counter += 1),
      });
    }
  
    render() {
      return (
        <div>
          <div>{this.state.counter}</div>
          <hr />
          <button type="button" onClick={this.handleIncrement}>
            +
          </button>
        </div>
      );
    }
  }`.split(' ');

const imports = dataArray.slice(
  dataArray.indexOf('import'),
  dataArray.indexOf('class')
);

const body = dataArray.slice(
  dataArray.indexOf('class'),
  dataArray.indexOf('render()')
);

const end = dataArray.slice(dataArray.indexOf('render()') + 1);

let importString = imports.join('');
importString = `import React, { useState } from 'react';`;
//PUSH TO IMPORTS

// BODY
const name = // find index of class + 2

//useState template
let useStateTemplate = `const [${state.var}, ${state.func}] = useState(${state.value});`

//func?


//END
//find this 
//indexOf(this) - 1 indexOf(})