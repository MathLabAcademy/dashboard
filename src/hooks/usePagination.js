import { get, isNull } from 'lodash-es'
import { stringify } from 'query-string'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { emptyObject } from 'utils/defaults.js'
import usePrevious from './usePrevious.js'

const defaultOptions = { maxTryCount: 3, initialQueryObject: emptyObject }

function usePagination(
  pagination,
  fetchPage,
  { maxTryCount = 3, initialQueryObject = emptyObject } = defaultOptions
) {
  const [tryCount, setTryCount] = useState(0)

  const [page, setPage] = useState(1)
  const prevPage = usePrevious(page)

  const [queryObject, setQueryObject] = useState(initialQueryObject)

  const query = useMemo(() => {
    return stringify(queryObject)
  }, [queryObject])

  useEffect(() => {
    setPage(1)
  }, [query])

  useEffect(() => {
    const prevQuery = get(pagination.pages, [page, 'query'], null)

    if (!isNull(prevQuery) && query === prevQuery) return

    setTryCount(c => (page === prevPage && query === prevQuery ? c + 1 : 1))

    if (tryCount < maxTryCount) fetchPage({ page, query })
  }, [
    fetchPage,
    maxTryCount,
    page,
    pagination.pages,
    prevPage,
    query,
    tryCount
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

  return [[page, onPageChange], setQueryObject]
}

export default usePagination
