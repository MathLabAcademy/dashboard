import api from 'utils/api.js'
import { defaultOptsFetchPage } from 'utils/defaults.js'
import { CQEXAM_ADD, CQEXAM_BULK_ADD, CQEXAM_UPDATE } from './actionTypes.js'

export const createCQExam = cqExamData => async dispatch => {
  const url = `/cqexams`

  const body = new FormData()

  for (const [key, value] of Object.entries(cqExamData)) {
    if (value instanceof File) body.set(key, value, value.name)
    else body.set(key, value)
  }

  const { data, error } = await api(url, {
    method: 'POST',
    body
  })

  if (error) throw error

  dispatch({ type: CQEXAM_ADD, data })

  return data
}

export const getCQExam = cqExamId => async dispatch => {
  let url = `/cqexams/${cqExamId}`

  const { data, error } = await api(url)

  if (error) throw error

  dispatch({ type: CQEXAM_ADD, data })

  return data
}

export const updateCQExam = (cqExamId, cqExamData) => async dispatch => {
  const url = `/cqexams/${cqExamId}`

  const body = new FormData()

  for (const [key, value] of Object.entries(cqExamData)) {
    if (value instanceof File) body.set(key, value, value.name)
    else body.set(key, value)
  }

  const { data, error } = await api(url, {
    method: 'PATCH',
    body
  })

  if (error) throw error

  dispatch({ type: CQEXAM_UPDATE, data })

  return data
}

export const getAllCQExamsForCourse = (
  courseId,
  { query = '' } = defaultOptsFetchPage
) => async dispatch => {
  let url = `/courses/${courseId}/cqexams`
  if (query) url += `?${query}`

  const { data, error } = await api(url)

  if (error) throw error

  dispatch({ type: CQEXAM_BULK_ADD, data })

  return data
}