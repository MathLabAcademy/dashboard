import api from 'utils/api'
import { defaultOptsFetchAllPages, defaultOptsFetchPage } from 'utils/defaults'
import {
  MCQTAG_ADD,
  MCQTAG_BULK_ADD,
  MCQTAG_PAGE_ADD,
  MCQTAG_PAGE_REMOVE,
  MCQTAG_PAGE_REQUEST,
  MCQTAG_UPDATE,
  MCQTAG_PAGINATION_PURGE,
} from './actionTypes'

export const createTag = (tagData) => async (dispatch) => {
  const url = `/mcqtags`

  const { data, error } = await api(url, {
    method: 'POST',
    body: tagData,
  })

  if (error) throw error

  dispatch({ type: MCQTAG_PAGINATION_PURGE })

  dispatch({ type: MCQTAG_ADD, data })

  return data
}

export const getTag = (tagId) => async (dispatch) => {
  const url = `/mcqtags/${tagId}`

  const { data, error } = await api(url)

  if (error) throw error

  dispatch({ type: MCQTAG_ADD, data })

  return data
}

export const updateTag = (tagId, tagData) => async (dispatch) => {
  const url = `/mcqtags/${tagId}`

  const { data, error } = await api(url, {
    method: 'PATCH',
    body: tagData,
  })

  if (error) throw error

  dispatch({ type: MCQTAG_UPDATE, data })

  return data
}

export const fetchTagPage = (
  { page = 1, query = '' } = defaultOptsFetchPage,
  storeItems = true
) => async (dispatch) => {
  dispatch({ type: MCQTAG_PAGE_REQUEST, page, query })

  let url = `/mcqtags?page=${page}`
  if (query) url += `&${query}`

  const { data, error } = await api(url)

  if (error) {
    dispatch({ type: MCQTAG_PAGE_REMOVE, page, query })
    throw error
  }

  if (storeItems) dispatch({ type: MCQTAG_BULK_ADD, data })

  dispatch({ type: MCQTAG_PAGE_ADD, page, data, query })

  return data
}

export const fetchAllTagPage = (
  { query = '' } = defaultOptsFetchAllPages,
  storeItems = true
) => async (dispatch) => {
  let page = 1
  let hasNext = true

  while (hasNext) {
    const { nextLink, pageIndex } = await dispatch(
      fetchTagPage({ page, query }, storeItems)
    )

    hasNext = Boolean(nextLink)
    page = pageIndex + 1
  }

  return true
}
