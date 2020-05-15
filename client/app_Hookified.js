/* eslint-disable react/no-unused-state */
import React, { useState, useEffect } from "react"
export default function App() {
  const [firstName, setFirstName] = useState("bobdog")
  const [lastName, setLastName] = useState("snob")
  const [friends, setFriends] = useState(["joe", "shmoe"])
  const [cats, setCats] = useState({ lstName: "woof" })
  const [kangaroo, setKangaroo] = useState({
    2: 3,
    name: "Jacki",
  })

  useEffect(() => {}, [])
  useEffect(() => {
    document.title = firstName
  }, [])

  function otherGenericMethod2() {
    const excitingVariable = 23
    setFirstName("catmeow")
  }
  function genericMethod() {
    const dullVariable = 24
    setLastName("wowow")
  }

  return (
    <div className="simple">
      <div>hi</div>
      <button
        type="button"
        onClick={function () {
          setCount(count + 1)
          setName(name)
        }}
      >
        Click me
      </button>
      <button
        type="button"
        onClick={() => {
          setCount(count + 2)
          setName(name)
        }}
      >
        Click Me
      </button>
      <button
        type="button"
        onClick={() => {
          setCount(count + 3)
          setName(name)
        }}
      >
        Click Me
      </button>
      <button
        type="button"
        onClick={() => {
          setCount(count + 4)
          setName(name)
        }}
      >
        Click Me
      </button>
    </div>
  )
}
