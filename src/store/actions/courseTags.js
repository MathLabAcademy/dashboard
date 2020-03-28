import api from 'utils/api'
import { defaultOptsFetchAllPages, defaultOptsFetchPage } from 'utils/defaults'
import {
  COURSETAG_ADD,
  COURSETAG_BULK_ADD,
  COURSETAG_PAGE_ADD,
  COURSETAG_PAGE_REMOVE,
  COURSETAG_PAGE_REQUEST,
  COURSETAG_PAGINATION_PURGE,
  COURSETAG_UPDATE,
} from './actionTypes'

export const createTag = (tagData) => async (dispatch) => {
  const url = `/coursetags`

  const { data, error } = await api(url, {
    method: 'POST',
    body: tagData,
  })

  if (error) throw error

  dispatch({ type: COURSETAG_PAGINATION_PURGE })

  dispatch({ type: COURSETAG_ADD, data })

  return data
}

export const getTag = (tagId) => async (dispatch) => {
  const url = `/coursetags/${tagId}`

  const { data, error } = await api(url)

  if (error) throw error

  dispatch({ type: COURSETAG_ADD, data })

  return data
}

export const updateTag = (tagId, tagData) => async (dispatch) => {
  const url = `/coursetags/${tagId}`

  const { data, error } = await api(url, {
    method: 'PATCH',
    body: tagData,
  })

  if (error) throw error

  dispatch({ type: COURSETAG_UPDATE, data })

  return data
}

export const fetchTagPage = (
  { page = 1, query = '' } = defaultOptsFetchPage,
  storeItems = true
) => async (dispatch) => {
  dispatch({ type: COURSETAG_PAGE_REQUEST, page, query })

  let url = `/coursetags?page=${page}`
  if (query) url += `&${query}`

  const { data, error } = await api(url)

  if (error) {
    dispatch({ type: COURSETAG_PAGE_REMOVE, page, query })
    throw error
  }

  if (storeItems) dispatch({ type: COURSETAG_BULK_ADD, data })

  dispatch({ type: COURSETAG_PAGE_ADD, page, data, query })

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
