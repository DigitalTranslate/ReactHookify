import React, { useState, useEffect } from "react"

function App() {
  const [firstName, setFirstName] = useState("bobdog")
  const [lastName, setLastName] = useState("snob")
  const [friends, setFriends] = useState(["joe", "shmoe"])
  const [cats, setCats] = useState({ lstName: "woof" })
  const [kangaroo, setKangaroo] = useState({
    2: 3,
    name: "Jacki",
  })

  useEffect(() => {
    function genericMethod() {
      const x = 1 + 2
    }
    genericMethod()
  }, [])

  function genericMethodT() {
    const dullVariable = 24
    setLastName("wowow")
  }

  return <div></div>
}
