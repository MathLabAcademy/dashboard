import api from 'utils/api.js'
import {
  defaultOptsFetchAllPages,
  defaultOptsFetchPage
} from 'utils/defaults.js'
import {
  CURRENT_USER_UPDATE,
  ENROLLMENT_BULK_ADD,
  USER_ADD,
  USER_BULK_ADD,
  USER_PAGE_ADD,
  USER_PAGE_REMOVE,
  USER_PAGE_REQUEST,
  USER_UPDATE
} from './actionTypes.js'

const addUser = data => ({
  type: USER_ADD,
  data
})

export const getUser = userId => async dispatch => {
  let url = `/users/${userId}`

  const { data, error } = await api(url)

  if (error) throw error

  dispatch(addUser(data))

  return data
}

export const findUser = ({
  userId,
  phone,
  batchClassEnrollmentId,
  batchCourseEnrollmentId
}) => async dispatch => {
  const url = `/users/action/find?userId=${userId}&phone=${phone}&batchClassEnrollmentId=${batchClassEnrollmentId}&batchCourseEnrollmentId=${batchCourseEnrollmentId}`

  const { data, error } = await api(url)

  if (error) throw error

  dispatch(addUser(data))

  return data
}

export const fetchUserPage = (
  { page = 1, query = '' } = defaultOptsFetchPage,
  storeItems = true
) => async dispatch => {
  dispatch({ type: USER_PAGE_REQUEST, page, query })

  let url = `/users?page=${page}`
  if (query) url += `&${query}`

  const { data, error } = await api(url)

  if (error) {
    dispatch({ type: USER_PAGE_REMOVE, page, query })
    throw error
  }

  if (storeItems) dispatch({ type: USER_BULK_ADD, data })

  dispatch({ type: USER_PAGE_ADD, page, data, query })

  return data
}

export const fetchAllUserPage = (
  { query = '' } = defaultOptsFetchAllPages,
  storeItems = true
) => async dispatch => {
  let page = 1
  let hasNext = true

  while (hasNext) {
    const { nextLink, pageIndex } = await dispatch(
      fetchUserPage({ page, query }, storeItems)
    )

    hasNext = Boolean(nextLink)
    page = pageIndex + 1
  }

  return true
}

export const updateEmail = (
  userId,
  emailData,
  { isGuardian, isCurrent }
) => async dispatch => {
  const url = isGuardian
    ? `/users/${userId}/person/guardian/email`
    : `/users/${userId}/person/email`

  const { data, error } = await api(url, {
    method: 'PATCH',
    body: emailData
  })
  if (error) throw error

  if (isCurrent) dispatch({ type: CURRENT_USER_UPDATE, data })

  dispatch({ type: USER_UPDATE, data })

  return data
}

export const updatePhone = (
  userId,
  phoneData,
  { isGuardian, isCurrent }
) => async dispatch => {
  const url = isGuardian
    ? `/users/${userId}/person/guardian/phone`
    : `/users/${userId}/person/phone`

  const { data, error } = await api(url, {
    method: 'PATCH',
    body: phoneData
  })
  if (error) throw error

  if (isCurrent) dispatch({ type: CURRENT_USER_UPDATE, data })

  dispatch({ type: USER_UPDATE, data })

  return data
}

export const updatePerson = (
  userId,
  personData,
  { isGuardian, isCurrent }
) => async dispatch => {
  const url = isGuardian
    ? `/users/${userId}/person/guardian`
    : `/users/${userId}/person`

  const { data, error } = await api(url, {
    method: 'PATCH',
    body: personData
  })

  if (error) throw error

  if (isCurrent) dispatch({ type: CURRENT_USER_UPDATE, data })

  dispatch({ type: USER_UPDATE, data })

  return data
}

export const readCredit = userId => async dispatch => {
  const url = `/users/${userId}/credit`

  const { data, error } = await api(url)

  if (error) throw error

  dispatch({ type: USER_UPDATE, data })

  return data
}

export const addCredit = (userId, transactionData) => async dispatch => {
  const url = `/users/${userId}/action/add-credit`

  const { data, error } = await api(url, {
    method: 'POST',
    body: transactionData
  })

  if (error) throw error

  dispatch({ type: USER_UPDATE, data })

  return data
}

export const getAllEnrollments = userId => async dispatch => {
  const url = `/users/${userId}/enrollments`

  const { data, error } = await api(url)

  if (error) throw error

  dispatch({ type: ENROLLMENT_BULK_ADD, data })

  return data
}
