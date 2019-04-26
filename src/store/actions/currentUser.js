import api from 'utils/api.js'

import {
  CURRENT_USER_LOGIN_REQUEST,
  CURRENT_USER_SET,
  CURRENT_USER_UNSET
} from './actionTypes'

export const logIn = loginData => async dispatch => {
  try {
    dispatch({ type: CURRENT_USER_LOGIN_REQUEST })

    const { data, error } = await api('/auth/login', {
      method: 'POST',
      body: loginData
    })

    if (error) throw error

    dispatch({ type: CURRENT_USER_SET, data })

    return data
  } catch (err) {
    dispatch({ type: CURRENT_USER_UNSET })
    throw err
  }
}

export const logOut = () => async dispatch => {
  const { data, error } = await api('/auth/logout', {
    method: 'POST'
  })

  if (error) throw error

  dispatch({ type: CURRENT_USER_UNSET })

  return data
}

export const checkAuthStatus = () => async dispatch => {
  const { data } = await api('/user')

  if (data) {
    dispatch({ type: CURRENT_USER_SET, data })

    return data
  }

  dispatch({ type: CURRENT_USER_UNSET })
}

export const updatePassword = passwordData => async dispatch => {
  const { error } = await api('/user/password', {
    method: 'POST',
    body: passwordData
  })

  if (error) throw error
}
