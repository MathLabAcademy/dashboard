import { useEffect, useState } from 'react'

function useCountdown({ endTime, interval = 1000 }) {
  const [countdown, setCountdown] = useState(0)

  useEffect(() => {
    const countdown = new Date(endTime) - new Date()
    setCountdown(countdown > 0 ? countdown : 0)
  }, [endTime])

  useEffect(() => {
    function tick() {
      setCountdown(countdown =>
        countdown > interval ? countdown - interval : 0
      )
    }

    const intervalID = setInterval(tick, interval)

    return () => clearInterval(intervalID)
  }, [interval])

  return [countdown]
}

export default useCountdown
