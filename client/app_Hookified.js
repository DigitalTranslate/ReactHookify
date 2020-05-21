import React, { useState, useEffect } from "react"
function FriendStatus(props) {
  const [isOnline, setIsOnline] = useState(null)

  useEffect(() => {
    function handleStatusChange(status) {
      setIsOnline(status.isOnline)
    }
    ChatAPI.subscribeToFriendStatus(props.friend.id, handleStatusChange)
    return () => {
      ChatAPI.unsubscribeFromFriendStatus(props.friend.id, handleStatusChange)
    }
  }, [])
  useEffect(() => {
    console.log("hi")
    genericMethod(5)
  }, [props.counter])

  function genericMethod(num) {
    handleStatusChange
    return num + 1
  }

  if (isOnline === null) {
    return "Loading..."
  }
  return (
    <div>
      {genericMethod(5)}
      <div>isOnline ? 'Online' : 'Offline';</div>;
    </div>
  )
}
