import { get, isNull } from 'lodash-es'
import { stringify } from 'query-string'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { emptyObject } from 'utils/defaults'
import usePrevious from './usePrevious'

const defaultOptions = { maxTryCount: 3, queryObject: emptyObject }

function usePagination(
  pagination,
  fetchPage,
  { maxTryCount = 3, queryObject = emptyObject } = defaultOptions
) {
  const [tryCount, setTryCount] = useState(0)

  const [page, setPage] = useState(1)
  const prevPage = usePrevious(page)

  const query = useMemo(() => {
    const objectToStringify = { ...queryObject }
    if (objectToStringify.filter) {
      objectToStringify.filter = JSON.stringify(objectToStringify.filter)
    }
    return stringify(objectToStringify)
  }, [queryObject])

  useEffect(() => {
    setPage(1)
  }, [query])

  useEffect(() => {
    const prevQuery = get(pagination.pages, [page, 'query'], null)

    if (!isNull(prevQuery) && query === prevQuery) return

    setTryCount((c) => (page === prevPage && query === prevQuery ? c + 1 : 1))

    if (tryCount < maxTryCount) fetchPage({ page, query })
  }, [
    fetchPage,
    maxTryCount,
    page,
    pagination.pages,
    prevPage,
    query,
    tryCount,
  ])

  const onPageChange = useCallback(
    (_, { activePage: page }) => {
      if (!get(pagination.pages, page)) {
        fetchPage({ page, query })
      }

      setPage(page)
    },
    [fetchPage, pagination.pages, query]
  )

  return [[page, onPageChange]]
}

export default usePagination
