import api from 'utils/api'
import { defaultOptsFetchPage } from 'utils/defaults'

export const CQEXAM_ADD = 'CQEXAM_ADD'
export const CQEXAM_BULK_ADD = 'CQEXAM_BULK_ADD'
export const CQEXAM_REMOVE = 'CQEXAM_REMOVE'
export const CQEXAM_UPDATE = 'CQEXAM_UPDATE'

export const createCQExam = ({
  courseId,
  date,
  name,
  description,
  questionPaperPdf,
  submissionDeadline,
}) => async (dispatch) => {
  const url = `/cqexams`

  const body = new FormData()

  for (const [key, value] of Object.entries({
    courseId,
    date,
    name,
    description,
    questionPaperPdf,
    submissionDeadline,
  })) {
    if (value instanceof File) body.set(key, value, value.name)
    else body.set(key, value)
  }

  const { data, error } = await api(url, {
    method: 'POST',
    body,
  })

  if (error) throw error

  dispatch({ type: CQEXAM_ADD, data })

  return data
}

export const getCQExam = (cqExamId) => async (dispatch) => {
  let url = `/cqexams/${cqExamId}`

  const { data, error } = await api(url)

  if (error) throw error

  dispatch({ type: CQEXAM_ADD, data })

  return data
}

export const updateCQExam = (cqExamId, cqExamData) => async (dispatch) => {
  const url = `/cqexams/${cqExamId}`

  const body = new FormData()

  for (const [key, value] of Object.entries(cqExamData)) {
    if (value instanceof File) body.set(key, value, value.name)
    else if (typeof value !== 'undefined') body.set(key, value)
  }

  const { data, error } = await api(url, {
    method: 'PATCH',
    body,
  })

  if (error) throw error

  dispatch({ type: CQEXAM_UPDATE, data })

  return data
}

export const getAllCQExamsForCourse = (
  courseId,
  { query = '' } = defaultOptsFetchPage
) => async (dispatch) => {
  let url = `/courses/${courseId}/cqexams`
  if (query) url += `?${query}`

  const { data, error } = await api(url)

  if (error) throw error

  dispatch({ type: CQEXAM_BULK_ADD, data })

  return data
}
