import React, { useEffect, useState } from 'react'

function getData() {
  return 'hi'
}

export default function TestFunc() {
  const [counter, setCounter] = useState(0)
  useEffect(() => {
    ;(async () => {
      const x = await getData()
      console.log('HIIIIII THIS WORKS')
    })()
  }, [])

  return <div>HI</div>
}
