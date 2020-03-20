import api from 'utils/api'
import { defaultOptsFetchAllPages, defaultOptsFetchPage } from 'utils/defaults'
import {
  MCQANSWER_ADD,
  MCQANSWER_BULK_ADD,
  MCQEXAMQUESTION_ADD,
  MCQIMAGE_ADD,
  MCQIMAGE_BULK_ADD,
  MCQIMAGE_TMP_ADD,
  MCQIMAGE_TMP_BULK_ADD,
  MCQSUBMISSION_UPDATE,
  MCQ_ADD,
  MCQ_BULK_ADD,
  MCQ_PAGE_ADD,
  MCQ_PAGE_REMOVE,
  MCQ_PAGE_REQUEST,
  MCQ_PAGINATION_PURGE,
  MCQ_UPDATE
} from './actionTypes'

export const createMCQ = mcqData => async dispatch => {
  const url = `/mcqs`

  const { data, error } = await api(url, {
    method: 'POST',
    body: mcqData
  })

  if (error) throw error

  dispatch({ type: MCQ_PAGINATION_PURGE })

  dispatch({ type: MCQ_ADD, data })

  if (mcqData.mcqExamId) {
    dispatch({
      type: MCQEXAMQUESTION_ADD,
      data: { mcqExamId: mcqData.mcqExamId, mcqId: data.id }
    })
  }

  dispatch(readMCQAnswer(data.id))

  return data
}

export const getMCQ = mcqId => async dispatch => {
  let url = `/mcqs/${mcqId}`

  const { data, error } = await api(url)

  if (error) throw error

  dispatch({ type: MCQ_ADD, data })

  return data
}

export const updateMCQ = (mcqId, mcqData) => async dispatch => {
  const url = `/mcqs/${mcqId}`

  const { data, error } = await api(url, {
    method: 'PATCH',
    body: mcqData
  })

  if (error) throw error

  dispatch({ type: MCQ_UPDATE, data })

  dispatch(readMCQAnswer(data.id))

  return data
}

export const getAllMCQsForExam = (
  mcqExamId,
  { query = '' } = defaultOptsFetchAllPages
) => async dispatch => {
  let url = `/mcqexams/${mcqExamId}/mcqs`
  if (query) url += `?${query}`

  const { data, error } = await api(url)

  if (error) throw error

  dispatch({ type: MCQ_BULK_ADD, data })

  return data
}

export const readMCQAnswer = mcqId => async dispatch => {
  const url = `/mcqs/${mcqId}/answer`

  const { data, error } = await api(url)

  if (error) throw error

  dispatch({ type: MCQANSWER_ADD, data })

  return data
}

export const setMCQAnswers = mcqAnswersData => async dispatch => {
  const url = `/mcqs/answers`

  const { data, error } = await api(url, {
    method: 'POST',
    body: mcqAnswersData
  })

  if (error) throw error

  dispatch({ type: MCQANSWER_BULK_ADD, data })

  return data
}

export const getAllMCQAnswersForExam = (
  mcqExamId,
  { query = '' } = defaultOptsFetchAllPages
) => async dispatch => {
  let url = `/mcqexams/${mcqExamId}/mcqanswers`
  if (query) url += `?${query}`

  const { data, error } = await api(url)

  if (error) throw error

  dispatch({ type: MCQANSWER_BULK_ADD, data })

  return data
}

export const submit = (mcqExamId, mcqId, submissionData) => async dispatch => {
  const url = `/mcqexams/${mcqExamId}/mcqs/${mcqId}/action/submit`

  const { data, error } = await api(url, {
    method: 'POST',
    body: submissionData
  })

  if (error) throw error

  dispatch({ type: MCQSUBMISSION_UPDATE, data })

  return data
}

export const fetchMCQPage = (
  { page = 1, query = '' } = defaultOptsFetchPage,
  storeItems = true
) => async dispatch => {
  dispatch({ type: MCQ_PAGE_REQUEST, page, query })

  let url = `/mcqs?page=${page}`
  if (query) url += `&${query}`

  const { data, error } = await api(url)

  if (error) {
    dispatch({ type: MCQ_PAGE_REMOVE, page, query })
    throw error
  }

  if (storeItems) dispatch({ type: MCQ_BULK_ADD, data })

  dispatch({ type: MCQ_PAGE_ADD, page, data, query })

  return data
}

export const getAllMCQImages = mcqId => async dispatch => {
  const url = `/mcqs/${mcqId}/images`

  const { data, error } = await api(url)

  if (error) throw error

  dispatch({ type: MCQIMAGE_BULK_ADD, data })

  return data
}

export const getAllMCQTmpImages = () => async dispatch => {
  const url = `/mcqs/tmp/images`

  const { data, error } = await api(url)

  if (error) throw error

  dispatch({ type: MCQIMAGE_TMP_BULK_ADD, data })

  return data
}

export const uploadMCQImage = (mcqId, mcqImageData) => async dispatch => {
  const url = `/mcqs/${mcqId}/images`

  const body = new FormData()

  for (const [key, value] of Object.entries(mcqImageData)) {
    if (value instanceof File) {
      body.set(key, value, value.name)
    } else if (typeof value !== 'undefined') {
      body.set(key, value)
    }
  }

  const { data, error } = await api(url, {
    method: 'POST',
    body
  })

  if (error) throw error

  dispatch({ type: MCQIMAGE_ADD, data })

  return data
}

export const uploadMCQTmpImage = mcqImageData => async dispatch => {
  const url = `/mcqs/tmp/images`

  const body = new FormData()

  for (const [key, value] of Object.entries(mcqImageData)) {
    if (value instanceof File) body.set(key, value, value.name)
    else body.set(key, value)
  }

  const { data, error } = await api(url, {
    method: 'POST',
    body
  })

  if (error) throw error

  dispatch({ type: MCQIMAGE_TMP_ADD, data })

  return data
}
