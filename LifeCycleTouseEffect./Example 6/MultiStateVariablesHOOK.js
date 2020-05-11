import React, { useState, useEffect } from 'react';

function Counter() {
  const [counter, incrementCounter] = useState(0);

  const [counter2, incrementCounter2] = useState(10);

  const [bool, setBool] = useState(false);

  useEffect(() => {
    incrementCounter2(counter2 + 1);
  }, []);

  useEffect(() => {
    if (limit === true) {
      incrementCounter(counter + 10);
    }
    document.title = counter;
  }, [bool]);

  useEffect(() => {
    return function cleanup() {};
  });

  function handleClick(value) {
    setBool(value);
  }

  return (
    <div>
      <div>{counter}</div>
      <hr />
      <button
        type="button"
        onClick={limit ? handleClick(false) : handleClick(true)}
      >
        +
      </button>
    </div>
  );
}
