import React, { useState, useEffect } from 'react';

function Counter() {
  const [counter, incrementCounter] = useState(0);

  const [bool, setBool] = useState(false);

  useEffect(() => {
    if (limit === true) {
      incrementCounter(counter + 10);
    }
    document.title = counter;
  }, [bool]);

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
