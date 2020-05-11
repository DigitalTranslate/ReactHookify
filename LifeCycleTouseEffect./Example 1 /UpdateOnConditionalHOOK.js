import React, { useState, useEffect } from 'react';

function Counter() {
  const [counter, incrementCounter] = useState(0);

  useEffect(() => {
    if (counter <= 10) {
      document.title = counter;
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
