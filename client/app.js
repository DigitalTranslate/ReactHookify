import React, {useState} from 'react' //prettier-ignore

function FriendStatus(props) {
  const [isOnline, setIsOnline] = useState(null)

  function genericFunction() {
    setIsOnline(true)
  }
  function genericFunction2() {
    console.log("genericFunction2")
  }

  if (isOnline === null) {
    return "Loading..."
  }

  return isOnline ? "Online" : "Offline"
}
