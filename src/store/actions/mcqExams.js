import api from 'utils/api.js'
import { defaultOptsFetchPage } from 'utils/defaults.js'
import {
  MCQEXAMTRACKER_UPDATE,
  MCQEXAM_ADD,
  MCQEXAM_BULK_ADD,
  MCQEXAM_UPDATE,
  MCQSUBMISSION_BULK_ADD,
  MCQEXAMQUESTION_BULK_ADD
} from './actionTypes.js'

export const createMCQExam = mcqExamData => async dispatch => {
  const url = `/mcqexams`

  const { data, error } = await api(url, {
    method: 'POST',
    body: mcqExamData
  })

  if (error) throw error

  dispatch({ type: MCQEXAM_ADD, data })

  return data
}

export const getMCQExam = mcqExamId => async dispatch => {
  let url = `/mcqexams/${mcqExamId}`

  const { data, error } = await api(url)

  if (error) throw error

  dispatch({ type: MCQEXAM_ADD, data })

  return data
}

export const updateMCQExam = (mcqExamId, mcqExamData) => async dispatch => {
  const url = `/mcqexams/${mcqExamId}`

  const { data, error } = await api(url, {
    method: 'PATCH',
    body: mcqExamData
  })

  if (error) throw error

  dispatch({ type: MCQEXAM_UPDATE, data })

  return data
}

export const getAllMCQExamsForCourse = (
  courseId,
  { query = '' } = defaultOptsFetchPage
) => async dispatch => {
  let url = `/courses/${courseId}/mcqexams`
  if (query) url += `?${query}`

  const { data, error } = await api(url)

  if (error) throw error

  dispatch({ type: MCQEXAM_BULK_ADD, data })

  return data
}

export const readTracker = mcqExamId => async dispatch => {
  const url = `/mcqexams/${mcqExamId}/tracker`

  const { data, error } = await api(url)

  if (error) throw error

  dispatch({ type: MCQEXAMTRACKER_UPDATE, data })

  return data
}

export const startTracker = mcqExamId => async dispatch => {
  const url = `/mcqexams/${mcqExamId}/tracker`

  const { data, error } = await api(url, {
    method: 'POST'
  })

  if (error) throw error

  dispatch({ type: MCQEXAMTRACKER_UPDATE, data })

  return data
}

export const pingTracker = mcqExamId => async dispatch => {
  const url = `/mcqexams/${mcqExamId}/tracker/ping`

  const { data, error } = await api(url, {
    method: 'POST'
  })

  if (error) throw error

  dispatch({ type: MCQEXAMTRACKER_UPDATE, data })

  return data
}

export const getAllQuestionsForExam = (
  mcqExamId,
  { query = '' } = defaultOptsFetchPage
) => async dispatch => {
  let url = `/mcqexams/${mcqExamId}/questions`
  if (query) url += `?${query}`

  const { data, error } = await api(url)

  if (error) throw error

  dispatch({ type: MCQEXAMQUESTION_BULK_ADD, data })

  return data
}

export const getAllSubmissions = mcqExamId => async dispatch => {
  const url = `/mcqexams/${mcqExamId}/mcqsubmissions`

  const { data, error } = await api(url)

  if (error) throw error

  dispatch({ type: MCQSUBMISSION_BULK_ADD, data })

  return data
}
