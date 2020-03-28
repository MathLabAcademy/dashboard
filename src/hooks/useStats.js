import { stringify } from 'query-string'
import { useEffect, useMemo, useState } from 'react'
import api from 'utils/api'
import { emptyObject } from 'utils/defaults'

export function useStats(key, queryObject = emptyObject) {
  const query = useMemo(() => stringify(queryObject), [queryObject])

  const [data, setData] = useState()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    api(`/stats/${key}?${query}`)
      .then(({ data }) => {
        setData(data)
        setLoading(false)
      })
      .catch((err) => {
        console.error(err)
        setLoading(false)
      })
  }, [key, query])

  return [data, loading]
}
