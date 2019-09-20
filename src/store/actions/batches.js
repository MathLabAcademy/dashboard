import api from 'utils/api.js'
import { defaultOptsFetchPage } from 'utils/defaults.js'
import {
  BATCHCLASSENROLLMENT_ADD,
  BATCHCLASSENROLLMENT_BULK_ADD,
  BATCHCLASSENROLLMENT_NEXT_SERIAL_SET,
  BATCHCLASSENROLLMENT_PAGE_ADD,
  BATCHCLASSENROLLMENT_PAGE_REMOVE,
  BATCHCLASSENROLLMENT_PAGE_REQUEST,
  BATCHCLASSENROLLMENT_PAGINATION_PURGE,
  BATCHCLASSFEE_ADD,
  BATCHCLASSFEE_BULK_ADD,
  BATCHCLASSFEE_PAGE_ADD,
  BATCHCLASSFEE_PAGE_REMOVE,
  BATCHCLASSFEE_PAGE_REQUEST,
  BATCHCLASSFEE_REMOVE,
  BATCHCLASSPAYMENT_ADD,
  BATCHCLASSPAYMENT_BULK_ADD,
  BATCHCLASS_ADD,
  BATCHCLASS_BULK_ADD,
  BATCHCLASS_PAGE_ADD,
  BATCHCLASS_PAGE_REMOVE,
  BATCHCLASS_PAGE_REQUEST,
  BATCHCLASS_PAGINATION_PURGE,
  BATCHCLASS_UPDATE,
  BATCHCOURSEENROLLMENT_ADD,
  BATCHCOURSEENROLLMENT_BULK_ADD,
  BATCHCOURSEENROLLMENT_NEXT_SERIAL_SET,
  BATCHCOURSEENROLLMENT_PAGE_ADD,
  BATCHCOURSEENROLLMENT_PAGE_REMOVE,
  BATCHCOURSEENROLLMENT_PAGE_REQUEST,
  BATCHCOURSEENROLLMENT_PAGINATION_PURGE,
  BATCHCOURSE_ADD,
  BATCHCOURSE_BULK_ADD,
  BATCHCOURSE_PAGE_ADD,
  BATCHCOURSE_PAGE_REMOVE,
  BATCHCOURSE_PAGE_REQUEST,
  BATCHCOURSE_PAGINATION_PURGE,
  BATCHCOURSE_UPDATE,
  BATCHSTUDENT_ADD,
  BATCHSTUDENT_BULK_ADD,
  BATCHSTUDENT_PAGE_ADD,
  BATCHSTUDENT_PAGE_REMOVE,
  BATCHSTUDENT_PAGE_REQUEST,
  BATCHSTUDENT_PAGINATION_PURGE,
  BATCHSTUDENT_UPDATE,
  USER_ADD,
  USER_BULK_ADD,
  USER_PAGINATION_PURGE
} from './actionTypes.js'

export const createBatchClass = batchClassData => async dispatch => {
  const url = `/batch/classes`

  const { data, error } = await api(url, {
    method: 'POST',
    body: batchClassData
  })

  if (error) throw error

  dispatch({ type: BATCHCLASS_PAGINATION_PURGE })
  dispatch({ type: BATCHCLASS_ADD, data })

  return data
}

export const getBatchClass = batchClassId => async dispatch => {
  let url = `/batch/classes/${batchClassId}`

  const { data, error } = await api(url)

  if (error) throw error

  dispatch({ type: BATCHCLASS_ADD, data })

  return data
}

export const updateBatchClass = (
  batchClassId,
  batchClassData
) => async dispatch => {
  const url = `/batch/classes/${batchClassId}`

  const { data, error } = await api(url, {
    method: 'PATCH',
    body: batchClassData
  })

  if (error) throw error

  dispatch({ type: BATCHCLASS_UPDATE, data })

  return data
}

export const fetchBatchClassPage = (
  { page = 1, query = '' } = defaultOptsFetchPage,
  storeItems = true
) => async dispatch => {
  dispatch({ type: BATCHCLASS_PAGE_REQUEST, page, query })

  let url = `/batch/classes?page=${page}`
  if (query) url += `&${query}`

  const { data, error } = await api(url)

  if (error) {
    dispatch({ type: BATCHCLASS_PAGE_REMOVE, page, query })
    throw error
  }

  if (storeItems) dispatch({ type: BATCHCLASS_BULK_ADD, data })

  dispatch({ type: BATCHCLASS_PAGE_ADD, page, data, query })

  return data
}

export const setBatchClassFee = (
  batchClassId,
  year,
  month,
  feeData
) => async dispatch => {
  const url = `/batch/classes/${batchClassId}/fees/${year}/${month}`

  const { data, error } = await api(url, {
    method: 'PUT',
    body: feeData
  })

  if (error) throw error

  dispatch({ type: BATCHCLASSFEE_ADD, data })

  return data
}

export const unsetBatchClassFee = (
  batchClassId,
  year,
  month
) => async dispatch => {
  const url = `/batch/classes/${batchClassId}/fees/${year}/${month}`

  const { data, error } = await api(url, {
    method: 'DELETE'
  })

  if (error) throw error

  dispatch({ type: BATCHCLASSFEE_REMOVE, data })

  return data
}

export const fetchBatchClassFeePage = (
  { page = 1, query = '' } = defaultOptsFetchPage,
  storeItems = true
) => async dispatch => {
  dispatch({ type: BATCHCLASSFEE_PAGE_REQUEST, page, query })

  let url = `/batch/classes/fees?page=${page}`
  if (query) url += `&${query}`

  const { data, error } = await api(url)

  if (error) {
    dispatch({ type: BATCHCLASSFEE_PAGE_REMOVE, page, query })
    throw error
  }

  if (storeItems) dispatch({ type: BATCHCLASSFEE_BULK_ADD, data })

  dispatch({ type: BATCHCLASSFEE_PAGE_ADD, page, data, query })

  return data
}

export const getAllBatchClassFeesForYear = (
  batchClassId,
  year
) => async dispatch => {
  const url = `/batch/classes/${batchClassId}/fees/${year}`

  const { data, error } = await api(url)

  if (error) throw error

  dispatch({ type: BATCHCLASSFEE_BULK_ADD, data })

  return data
}

export const getBatchClassFeeForMonth = (
  batchClassId,
  year,
  month
) => async dispatch => {
  const url = `/batch/classes/${batchClassId}/fees/${year}/${month}`

  const { data, error } = await api(url)

  if (error) throw error

  dispatch({ type: BATCHCLASSFEE_ADD, data })

  return data
}

export const getAllBatchClassEnrollmentForYear = (
  batchClassId,
  year
) => async dispatch => {
  const url = `/batch/classes/${batchClassId}/enrollments/years/${year}`

  const { data, error } = await api(url)

  if (error) throw error

  const usersData = { items: [] }

  data.items.forEach(item => {
    const user = item.User
    usersData.items.push(user)
    delete item.User
  })

  dispatch({ type: USER_BULK_ADD, data: usersData })
  dispatch({ type: BATCHCLASSENROLLMENT_BULK_ADD, data })

  return data
}

export const getAllClassPaymentForMonth = (
  batchClassId,
  year,
  month
) => async dispatch => {
  const url = `/batch/classes/${batchClassId}/payments/years/${year}/months/${month}`

  const { data, error } = await api(url)

  if (error) throw error

  dispatch({ type: BATCHCLASSPAYMENT_BULK_ADD, data })

  return data
}

export const createClassPaymentForMonth = (
  batchClassId,
  year,
  month,
  batchClassPaymentData
) => async dispatch => {
  const url = `/batch/classes/${batchClassId}/payments/years/${year}/months/${month}`

  const { data, error } = await api(url, {
    method: 'POST',
    body: batchClassPaymentData
  })

  if (error) throw error

  dispatch({ type: BATCHCLASSPAYMENT_ADD, data })

  return data
}

export const fetchBatchClassEnrollmentPage = (
  { page = 1, query = '' } = defaultOptsFetchPage,
  storeItems = true
) => async dispatch => {
  dispatch({ type: BATCHCLASSENROLLMENT_PAGE_REQUEST, page, query })

  let url = `/batch/classenrollments?page=${page}`
  if (query) url += `&${query}`

  const { data, error } = await api(url)

  if (error) {
    dispatch({ type: BATCHCLASSENROLLMENT_PAGE_REMOVE, page, query })
    throw error
  }

  if (storeItems) dispatch({ type: BATCHCLASSENROLLMENT_BULK_ADD, data })

  dispatch({ type: BATCHCLASSENROLLMENT_PAGE_ADD, page, data, query })

  return data
}

export const createBatchClassEnrollmentForNewStudent = batchClassEnrollmentData => async dispatch => {
  const url = `/batch/classenrollments/new-student`

  const { data, error } = await api(url, {
    method: 'POST',
    body: batchClassEnrollmentData
  })

  if (error) throw error

  dispatch({ type: USER_PAGINATION_PURGE })
  dispatch({ type: BATCHCLASSENROLLMENT_PAGINATION_PURGE })
  dispatch({ type: BATCHCLASSENROLLMENT_ADD, data })

  return data
}

export const createBatchClassEnrollmentForOldStudent = batchClassEnrollmentData => async dispatch => {
  const url = `/batch/classenrollments/old-student`

  const { data, error } = await api(url, {
    method: 'POST',
    body: batchClassEnrollmentData
  })

  if (error) throw error

  dispatch({ type: BATCHCLASSENROLLMENT_PAGINATION_PURGE })
  dispatch({ type: BATCHCLASSENROLLMENT_ADD, data })

  return data
}

export const updateBatchClassEnrollment = (
  batchClassEnrollmentId,
  batchClassEnrollmentData
) => async dispatch => {
  const url = `/batch/classenrollments/${batchClassEnrollmentId}`

  const { data, error } = await api(url, {
    method: 'PATCH',
    body: batchClassEnrollmentData
  })

  if (error) throw error

  const userData = data.User
  delete data.User

  dispatch({ type: BATCHCLASSENROLLMENT_ADD, data })
  dispatch({ type: USER_ADD, data: userData })

  return data
}

export const getBatchClassEnrollment = batchClassEnrollmentId => async dispatch => {
  const url = `/batch/classenrollments/${batchClassEnrollmentId}`

  const { data, error } = await api(url)

  if (error) throw error

  const userData = data.User
  delete data.User

  dispatch({ type: BATCHCLASSENROLLMENT_ADD, data })
  dispatch({ type: USER_ADD, data: userData })

  return data
}

export const getAllBatchClassPaymentsForEnrollment = batchClassEnrollmentId => async dispatch => {
  const url = `/batch/classenrollments/${batchClassEnrollmentId}/payments`

  const { data, error } = await api(url)

  if (error) throw error

  dispatch({ type: BATCHCLASSPAYMENT_BULK_ADD, data })

  return data
}

export const getBatchClassEnrollmentNextSerial = (
  batchClassId,
  year
) => async dispatch => {
  let url = `/batch/classes/${batchClassId}/enrollments/years/${year}/next-serial`

  const { data, error, params } = await api(url)

  if (error) throw error

  dispatch({ type: BATCHCLASSENROLLMENT_NEXT_SERIAL_SET, data, params })

  return data
}

export const createBatchCourse = batchCourseData => async dispatch => {
  const url = `/batch/courses`

  const { data, error } = await api(url, {
    method: 'POST',
    body: batchCourseData
  })

  if (error) throw error

  dispatch({ type: BATCHCOURSE_PAGINATION_PURGE })
  dispatch({ type: BATCHCOURSE_ADD, data })

  return data
}

export const getBatchCourse = batchCourseId => async dispatch => {
  let url = `/batch/courses/${batchCourseId}`

  const { data, error } = await api(url)

  if (error) throw error

  dispatch({ type: BATCHCOURSE_ADD, data })

  return data
}

export const updateBatchCourse = (
  batchCourseId,
  batchCourseData
) => async dispatch => {
  const url = `/batch/courses/${batchCourseId}`

  const { data, error } = await api(url, {
    method: 'PATCH',
    body: batchCourseData
  })

  if (error) throw error

  dispatch({ type: BATCHCOURSE_UPDATE, data })

  return data
}

export const fetchBatchCoursePage = (
  { page = 1, query = '' } = defaultOptsFetchPage,
  storeItems = true
) => async dispatch => {
  dispatch({ type: BATCHCOURSE_PAGE_REQUEST, page, query })

  let url = `/batch/courses?page=${page}`
  if (query) url += `&${query}`

  const { data, error } = await api(url)

  if (error) {
    dispatch({ type: BATCHCOURSE_PAGE_REMOVE, page, query })
    throw error
  }

  if (storeItems) dispatch({ type: BATCHCOURSE_BULK_ADD, data })

  dispatch({ type: BATCHCOURSE_PAGE_ADD, page, data, query })

  return data
}

export const fetchBatchCourseEnrollmentPage = (
  { page = 1, query = '' } = defaultOptsFetchPage,
  storeItems = true
) => async dispatch => {
  dispatch({ type: BATCHCOURSEENROLLMENT_PAGE_REQUEST, page, query })

  let url = `/batch/courseenrollments?page=${page}`
  if (query) url += `&${query}`

  const { data, error } = await api(url)

  if (error) {
    dispatch({ type: BATCHCOURSEENROLLMENT_PAGE_REMOVE, page, query })
    throw error
  }

  if (storeItems) dispatch({ type: BATCHCOURSEENROLLMENT_BULK_ADD, data })

  dispatch({ type: BATCHCOURSEENROLLMENT_PAGE_ADD, page, data, query })

  return data
}

export const createBatchCourseEnrollment = batchCourseEnrollmentData => async dispatch => {
  const url = `/batch/courseenrollments`

  const { data, error } = await api(url, {
    method: 'POST',
    body: batchCourseEnrollmentData
  })

  if (error) throw error

  dispatch({ type: BATCHCOURSEENROLLMENT_PAGINATION_PURGE })
  dispatch({ type: BATCHCOURSEENROLLMENT_ADD, data })

  return data
}

export const getBatchCourseEnrollment = batchCourseEnrollmentId => async dispatch => {
  const url = `/batch/courseenrollments/${batchCourseEnrollmentId}`

  const { data, error } = await api(url)

  if (error) throw error

  dispatch({ type: BATCHCOURSEENROLLMENT_ADD, data })

  return data
}

export const getBatchCourseEnrollmentNextSerial = (
  batchCourseId,
  year
) => async dispatch => {
  let url = `/batch/courses/${batchCourseId}/enrollments/years/${year}/next-serial`

  const { data, error, params } = await api(url)

  if (error) throw error

  dispatch({ type: BATCHCOURSEENROLLMENT_NEXT_SERIAL_SET, data, params })

  return data
}

export const createBatchStudent = batchClassData => async dispatch => {
  const url = `/batch/students`

  const { data, error } = await api(url, {
    method: 'POST',
    body: batchClassData
  })

  if (error) throw error

  dispatch({ type: BATCHSTUDENT_PAGINATION_PURGE })
  dispatch({ type: BATCHSTUDENT_ADD, data })

  return data
}

export const getBatchStudent = batchStudentId => async dispatch => {
  let url = `/batch/students/${batchStudentId}`

  const { data, error } = await api(url)

  if (error) throw error

  dispatch({ type: BATCHSTUDENT_ADD, data })

  return data
}

export const updateBatchStudent = (
  batchStudentId,
  batchStudentData
) => async dispatch => {
  const url = `/batch/students/${batchStudentId}`

  const { data, error } = await api(url, {
    method: 'PATCH',
    body: batchStudentData
  })

  if (error) throw error

  dispatch({ type: BATCHSTUDENT_UPDATE, data })

  return data
}

export const fetchBatchStudentPage = (
  { page = 1, query = '' } = defaultOptsFetchPage,
  storeItems = true
) => async dispatch => {
  dispatch({ type: BATCHSTUDENT_PAGE_REQUEST, page, query })

  let url = `/batch/students?page=${page}`
  if (query) url += `&${query}`

  const { data, error } = await api(url)

  if (error) {
    dispatch({ type: BATCHSTUDENT_PAGE_REMOVE, page, query })
    throw error
  }

  if (storeItems) dispatch({ type: BATCHSTUDENT_BULK_ADD, data })

  dispatch({ type: BATCHSTUDENT_PAGE_ADD, page, data, query })

  return data
}
