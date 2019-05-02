import { combineReducers } from 'redux'
import {
  USER_PAGE_ADD,
  USER_PAGE_REMOVE,
  USER_PAGE_REQUEST,
  USER_PAGINATION_PURGE
} from 'store/actions/actionTypes.js'
import getPaginationReducer from './helpers/get-pagination-reducer.js'

const paginationReducer = combineReducers({
  users: getPaginationReducer({
    ADD: USER_PAGE_ADD,
    REMOVE: USER_PAGE_REMOVE,
    REQUEST: USER_PAGE_REQUEST
  })
})

export default (state, action) => {
  switch (action.type) {
    case USER_PAGINATION_PURGE:
      state.users = undefined
      break
    default:
      break
  }

  return paginationReducer(state, action)
}
