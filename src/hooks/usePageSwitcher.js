import { useMemo } from 'react'

export function usePageBasedPaging({ pageIndex: _pageIndex, totalPages }) {
  const pageIndex = +_pageIndex

  const pages = useMemo(() => {
    const pages = []

    pages.push({
      page: 1,
      current: 1 === pageIndex,
      content: `<<`,
    })

    for (let page = 1; page <= totalPages; page++) {
      if (page === pageIndex - 2 || page === pageIndex + 2) {
        pages.push({
          page,
          disabled: true,
          current: page === pageIndex,
          content: `...`,
          link: `#`,
        })
      }

      if ([pageIndex - 1, pageIndex, pageIndex + 1].includes(page)) {
        pages.push({
          page,
          current: page === pageIndex,
          content: `${page}`,
        })
      }
    }

    pages.push({
      page: totalPages,
      current: totalPages <= pageIndex,
      content: `>>`,
    })

    return pages
  }, [pageIndex, totalPages])

  return pages
}
