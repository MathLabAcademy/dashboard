import api from 'utils/api'

export const ROLE_BULK_ADD = 'ROLE_BULK_ADD'

export const readAllRole = () => async (dispatch) => {
  const { data, error } = await api('/roles')

  if (error) throw error

  dispatch({ type: ROLE_BULK_ADD, data })

  return data
}
