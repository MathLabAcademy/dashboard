import { useEffect, useState } from 'react'
import api from 'utils/api'

export function useVideo(videoProvider, videoId) {
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (videoId && videoProvider) {
      setLoading(true)

      api(`/videos/${videoProvider}/${videoId}`).then(({ data, error }) => {
        if (error) {
          setError(error)
        } else {
          setData(data)
        }

        setLoading(false)
      })
    }
  }, [videoId, videoProvider])

  return { loading, data, error }
}
