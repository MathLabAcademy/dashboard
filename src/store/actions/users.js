import api from 'utils/api.js'

import { CURRENT_USER_SET, USER_UPDATE } from './actionTypes.js'

export const updatePersonInfo = (
  userId,
  personInfo,
  isCurrent = false
) => async dispatch => {
  const url = `/users/${userId}/person`

  const { data, error } = await api(url, {
    method: 'PATCH',
    body: personInfo
  })

  if (error) throw error

  if (isCurrent) {
    dispatch({ type: CURRENT_USER_SET, data })
  }

  dispatch({ type: USER_UPDATE, data })

  return data
}

export const updateGuardianInfo = (
  userId,
  guardianInfo,
  isCurrent = false
) => async dispatch => {
  const url = `/users/${userId}/person/guardian`

  const { data, error } = await api(url, {
    method: 'PATCH',
    body: guardianInfo
  })

  if (error) throw error

  if (isCurrent) {
    dispatch({ type: CURRENT_USER_SET, data })
  }

  dispatch({ type: USER_UPDATE, data })

  return data
}
