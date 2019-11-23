import api from 'utils/api'
import { defaultOptsFetchPage } from 'utils/defaults'
import { TRANSACTION_BULK_ADD } from './actionTypes'

export const getAllTransactionsForUser = (
  userId,
  { query = '' } = defaultOptsFetchPage
) => async dispatch => {
  let url = `/users/${userId}/transactions`
  if (query) url += `?${query}`

  const { data, error } = await api(url)

  if (error) throw error

  dispatch({ type: TRANSACTION_BULK_ADD, data })

  return data
}
