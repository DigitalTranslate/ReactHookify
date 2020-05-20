import React, { useState } from "react"
function Reservation(props) {
  const [isGoing, setIsGoing] = useState(true)
  const [numberOfGuests, setNumberOfGuests] = useState(2)

  function handleSomething(event) {
    /*
	This is tricky to translate to hooks and would require some manual refactoring
	*/
    /*this.setState(props.something)*/
  }

  return (
    <form>
      <label>
        Is going:
        <input
          name="isGoing"
          type="checkbox"
          checked={isGoing}
          onChange={handleInputChange}
        />
      </label>
      <br />
      <label>
        Number of guests:
        <input
          name="numberOfGuests"
          type="number"
          value={numberOfGuests}
          onChange={handleInputChange}
        />
      </label>
    </form>
  )
}
