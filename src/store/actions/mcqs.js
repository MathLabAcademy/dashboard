import api from 'utils/api.js'
import { defaultOptsFetchPage } from 'utils/defaults.js'
import {
  MCQANSWER_BULK_ADD,
  MCQSUBMISSION_UPDATE,
  MCQ_ADD,
  MCQ_BULK_ADD,
  MCQ_UPDATE
} from './actionTypes.js'

export const createMCQ = mcqData => async dispatch => {
  const url = `/mcqs`

  const { data, error } = await api(url, {
    method: 'POST',
    body: mcqData
  })

  if (error) throw error

  dispatch({ type: MCQ_ADD, data })

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

export const getAllMCQsForExam = (
  mcqExamId,
  { query = '' } = defaultOptsFetchPage
) => async dispatch => {
  let url = `/mcqexams/${mcqExamId}/mcqs`
  if (query) url += `?${query}`

  const { data, error } = await api(url)

  if (error) throw error

  dispatch({ type: MCQ_BULK_ADD, data })

  return data
}

export const getAllMCQAnswersForExam = (
  mcqExamId,
  { query = '' } = defaultOptsFetchPage
) => async dispatch => {
  let url = `/mcqexams/${mcqExamId}/mcqanswers`
  if (query) url += `?${query}`

  const { data, error } = await api(url)

  if (error) throw error

  dispatch({ type: MCQANSWER_BULK_ADD, data })

  return data
}

export const submit = (mcqId, submissionData) => async dispatch => {
  const url = `/mcqs/${mcqId}/action/submit`

  const { data, error } = await api(url, {
    method: 'POST',
    body: submissionData
  })

  if (error) throw error

  dispatch({ type: MCQSUBMISSION_UPDATE, data })

  return data
}
