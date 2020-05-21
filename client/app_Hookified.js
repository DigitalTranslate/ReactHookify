import React, { useState, useEffect } from "react"
function FriendStatus(props) {
  const [isOnline, setIsOnline] = useState(null)
  const [test, setTest] = useState(0)

  useEffect(() => {
    ChatAPI.subscribeToFriendStatus(props.friend.id, handleStatusChange)
    return () => {
      ChatAPI.unsubscribeFromFriendStatus(props.friend.id, handleStatusChange)
    }
  }, [])
  useEffect(() => {
    console.log("hi")
  }, [props.test])

  function handleStatusChange(status) {
    setIsOnline(status.isOnline)
  }
  function test() {
    console.log("hi")
  }

  if (isOnline === null) {
    return "Loading..."
  }
  return isOnline ? "Online" : "Offline"
}
