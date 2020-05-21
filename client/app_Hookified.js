import React, { useState, useEffect } from "react"
export default function App(props) {
  const [firstName, setFirstName] = useState("bobdog")
  const [lastName, setLastName] = useState("snob")
  const [friends, setFriends] = useState(["joe", "shmoe"])
  const [cats, setCats] = useState({ lstName: "woof" })
  const [kangaroo, setKangaroo] = useState({
    2: 3,
    name: "Jacki",
  })

  useEffect(() => {
    function handleStatusChange(status) {
      setIsOnline(status.isOnline)
    }
    ChatAPI.subscribeToFriendStatus(props.friend.id, handleStatusChange)
  }, [])
  useEffect(() => {
    return () => {
      ChatAPI.unsubscribeFromFriendStatus(props.friend.id, handleStatusChange2)
    }
  }, [])

  function otherGenericMethod2() {
    const excitingVariable = 23
    setFirstName("catmeow")
  }
  function genericMethod() {
    const dullVariable = 24
    setLastName("wowow")
  }
  function genericMethodTest() {
    const dullVariable = 24
    setLastName("wowow")
  }

  const x = firstName
  return (
    <div className="simple">
      <div>hi</div>
      <button
        type="button"
        onClick={async function () {
          await setCount(count + 1)
          await setName(name)
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
