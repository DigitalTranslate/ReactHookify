import React, { useState, useEffect } from 'react';

function Counter() {
  const [counter, incrementCounter] = useState(0);

  const [bool, setBool] = useState(false);

  useEffect(() => {
    if (counter > 10) {
      setBool((bool = true));
    }
  }, [counter]);

  function handleIncrement() {
    incrementCounter(counter + 1);
  }

  return (
    <div>
      <div>{counter}</div>
      <hr />
      <button type="button" onClick={handleIncrement}>
        +
      </button>
    </div>
  );
}
