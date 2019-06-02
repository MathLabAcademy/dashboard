import api from 'utils/api.js'
import { defaultOptsFetchPage } from 'utils/defaults.js'
import {
  BATCHCLASS_ADD,
  BATCHCLASS_BULK_ADD,
  BATCHCLASS_PAGE_ADD,
  BATCHCLASS_PAGE_REMOVE,
  BATCHCLASS_PAGE_REQUEST,
  BATCHCLASS_PAGINATION_PURGE,
  BATCHCLASS_UPDATE,
  BATCHFEE_ADD,
  BATCHFEE_BULK_ADD,
  BATCHPAYMENT_ADD,
  BATCHPAYMENT_BULK_ADD,
  BATCHSTUDENT_ADD,
  BATCHSTUDENT_BULK_ADD,
  BATCHSTUDENT_NEXT_ID_SET,
  BATCHSTUDENT_PAGE_ADD,
  BATCHSTUDENT_PAGE_REMOVE,
  BATCHSTUDENT_PAGE_REQUEST,
  BATCHSTUDENT_PAGINATION_PURGE,
  BATCHSTUDENT_UPDATE,
  BATCHPAYMENT_REMOVE
} from './actionTypes.js'

export const createBatchClass = batchClassData => async dispatch => {
  const url = `/batches/classes`

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
  let url = `/batches/classes/${batchClassId}`

  const { data, error } = await api(url)

  if (error) throw error

  dispatch({ type: BATCHCLASS_ADD, data })

  return data
}

export const updateBatchClass = (
  batchClassId,
  batchClassData
) => async dispatch => {
  const url = `/batches/classes/${batchClassId}`

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

  let url = `/batches/classes?page=${page}`
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
  const url = `/batches/classes/${batchClassId}/fees/${year}/${month}`

  const { data, error } = await api(url, {
    method: 'PUT',
    body: feeData
  })

  if (error) throw error

  dispatch({ type: BATCHFEE_ADD, data })

  return data
}

export const getAllBatchClassFeesForYear = (
  batchClassId,
  year
) => async dispatch => {
  const url = `/batches/classes/${batchClassId}/fees/${year}`

  const { data, error } = await api(url)

  if (error) throw error

  dispatch({ type: BATCHFEE_BULK_ADD, data })

  return data
}

export const getBatchClassFeeForMonth = (
  batchClassId,
  year,
  month
) => async dispatch => {
  const url = `/batches/classes/${batchClassId}/fees/${year}/${month}`

  const { data, error } = await api(url)

  if (error) throw error

  dispatch({ type: BATCHFEE_ADD, data })

  return data
}

export const removePayment = batchPaymentId => async dispatch => {
  const url = `/batches/payments/${batchPaymentId}`

  const { data, error } = await api(url, {
    method: 'DELETE'
  })

  if (error) throw error

  dispatch({ type: BATCHPAYMENT_REMOVE, data })

  return data
}

export const createBatchStudent = batchClassData => async dispatch => {
  const url = `/batches/students`

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
  let url = `/batches/students/${batchStudentId}`

  const { data, error } = await api(url)

  if (error) throw error

  dispatch({ type: BATCHSTUDENT_ADD, data })

  return data
}

export const updateBatchStudent = (
  batchStudentId,
  batchStudentData
) => async dispatch => {
  const url = `/batches/students/${batchStudentId}`

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

  let url = `/batches/students?page=${page}`
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

export const getBatchStudentNextId = ({ query = '' }) => async dispatch => {
  let url = `/batches/students/next-id`
  if (query) url += `?${query}`

  const { data, error } = await api(url)

  if (error) throw error

  dispatch({ type: BATCHSTUDENT_NEXT_ID_SET, data, query })

  return data
}

export const getAllBatchStudentPayments = batchStudentId => async dispatch => {
  const url = `/batches/students/${batchStudentId}/payments`

  const { data, error } = await api(url)

  if (error) throw error

  dispatch({ type: BATCHPAYMENT_BULK_ADD, data })

  return data
}

export const setBatchStudentPaymentMonthPaid = (
  batchStudentId,
  paymentData
) => async dispatch => {
  const url = `/batches/students/${batchStudentId}/payments/action/set-month-paid`

  const { data, error } = await api(url, {
    method: 'POST',
    body: paymentData
  })

  if (error) throw error

  dispatch({ type: BATCHPAYMENT_ADD, data })

  return data
}
