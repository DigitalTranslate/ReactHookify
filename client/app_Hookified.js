import React, { useState, useEffect } from "react"
function FriendStatus(props) {
  const [isOnline, setIsOnline] = useState(null)

  useEffect(() => {
    function genericFunction() {
      console.log("genericFunction")
    }
    genericFunction()
  }, [])

  function genericFunction2() {
    console.log("genericFunction2")
  }

  if (isOnline === null) {
    return "Loading..."
  }
  return isOnline ? "Online" : "Offline"
}
