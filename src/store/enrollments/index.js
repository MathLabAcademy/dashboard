import api from 'utils/api'

export const ENROLLMENT_ADD = 'ENROLLMENT_ADD'
export const ENROLLMENT_BULK_ADD = 'ENROLLMENT_BULK_ADD'
export const ENROLLMENT_UPDATE = 'ENROLLMENT_UPDATE'

export const toggleEnrollmentStatus = (enrollmentId) => async (dispatch) => {
  const url = `/enrollments/${enrollmentId}/actions/toggle-status`

  const { data, error } = await api(url, {
    method: 'POST',
  })

  if (error) throw error

  delete data.User

  dispatch({ type: ENROLLMENT_UPDATE, data })

  return data
}

export const getOwnEnrollments = () => async (dispatch) => {
  const { data, error } = await api(`/user/enrollments`, {
    method: 'GET',
  })

  if (error) throw error

  dispatch({ type: ENROLLMENT_BULK_ADD, data })

  return data
}
