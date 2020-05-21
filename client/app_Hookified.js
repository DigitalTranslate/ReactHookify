import React, { useState, useEffect } from "react"
function FriendStatus(props) {
  const [isOnline, setIsOnline] = useState(null)

  useEffect(() => {
    function test(num) {
      console.log(num)
    }
    test(5)
  }, [])
  useEffect(() => {
    console.log("hi")
  }, [props.counter])

  function handleStatusChange(status) {
    console.log("HELLO")
  }

  return <div>Test</div>
}
