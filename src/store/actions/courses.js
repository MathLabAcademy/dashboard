import api from 'utils/api'
import { defaultOptsFetchAllPages, defaultOptsFetchPage } from 'utils/defaults'
import {
  COURSE_ADD,
  COURSE_BULK_ADD,
  COURSE_PAGE_ADD,
  COURSE_PAGE_REMOVE,
  COURSE_PAGE_REQUEST,
  COURSE_PAGINATION_PURGE,
  COURSE_UPDATE,
  ENROLLMENT_ADD,
  ENROLLMENT_BULK_ADD,
  USER_BULK_ADD
} from './actionTypes'

export const createCourse = courseData => async dispatch => {
  const url = `/courses`

  const { data, error } = await api(url, {
    method: 'POST',
    body: courseData
  })

  if (error) throw error

  dispatch({ type: COURSE_PAGINATION_PURGE })
  dispatch({ type: COURSE_ADD, data })

  return data
}

export const getCourse = courseId => async dispatch => {
  let url = `/courses/${courseId}`

  const { data, error } = await api(url)

  if (error) throw error

  dispatch({ type: COURSE_ADD, data })

  return data
}

export const updateCourse = (courseId, courseData) => async dispatch => {
  const url = `/courses/${courseId}`

  const { data, error } = await api(url, {
    method: 'PATCH',
    body: courseData
  })

  if (error) throw error

  dispatch({ type: COURSE_UPDATE, data })

  return data
}

export const fetchCoursePage = (
  { page = 1, query = '' } = defaultOptsFetchPage,
  storeItems = true
) => async dispatch => {
  dispatch({ type: COURSE_PAGE_REQUEST, page, query })

  let url = `/courses?page=${page}`
  if (query) url += `&${query}`

  const { data, error } = await api(url)

  if (error) {
    dispatch({ type: COURSE_PAGE_REMOVE, page, query })
    throw error
  }

  if (storeItems) dispatch({ type: COURSE_BULK_ADD, data })

  dispatch({ type: COURSE_PAGE_ADD, page, data, query })

  return data
}

export const fetchAllCoursePage = (
  { query = '' } = defaultOptsFetchAllPages,
  storeItems = true
) => async dispatch => {
  let page = 1
  let hasNext = true

  while (hasNext) {
    const { nextLink, pageIndex } = await dispatch(
      fetchCoursePage({ page, query }, storeItems)
    )

    hasNext = Boolean(nextLink)
    page = pageIndex + 1
  }

  return true
}

export const enroll = (courseId, { couponId } = {}) => async dispatch => {
  const url = `/courses/${courseId}/action/enroll`

  const { data, error } = await api(url, {
    method: 'POST',
    body: { couponId }
  })

  if (error) throw error

  dispatch({ type: ENROLLMENT_ADD, data })

  return data
}

export const getAllEnrollments = courseId => async dispatch => {
  const url = `/courses/${courseId}/enrollments`

  const { data, error } = await api(url)

  if (error) throw error

  const usersData = { items: [] }

  data.items.forEach(item => {
    const user = item.User
    usersData.items.push(user)
    delete item.User
  })

  console.log(usersData)

  dispatch({ type: USER_BULK_ADD, data: usersData })
  dispatch({ type: ENROLLMENT_BULK_ADD, data })

  return data
}
