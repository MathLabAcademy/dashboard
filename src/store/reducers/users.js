import { combineReducers } from 'redux'

import keyBy from 'lodash/keyBy'
import pickBy from 'lodash/pickBy'

import * as allIds from './helpers/allIds-reducers.js'
import getPaginationReducer from './helpers/get-pagination-reducer.js'

import {
  USER_ADD,
  USER_REMOVE,
  USER_UPDATE,
  USERS_ADD_BULK,
  USERS_ADD_PAGE,
  USERS_REMOVE_PAGE,
  USERS_REQUEST_PAGE,
  USERS_PURGE_PAGINATION
} from 'store/actions/actionTypes.js'

const itemsReducer = (state = { byId: {}, allIds: [] }, { type, data, id }) => {
  switch (type) {
    case USER_ADD:
      return {
        ...state,
        byId: {
          ...state.byId,
          [data.id]: {
            ...data
          }
        },
        allIds: allIds.add(state.allIds, data)
      }
    case USERS_ADD_BULK:
      return {
        ...state,
        byId: {
          ...state.byId,
          ...keyBy(data.items, 'id')
        },
        allIds: allIds.addBulk(state.allIds, data)
      }
    case USER_REMOVE:
      return {
        ...state,
        byId: pickBy(state.byId, i => i !== id),
        allIds: allIds.remove(state.allIds, id)
      }
    case USER_UPDATE:
      return {
        ...state,
        byId: {
          ...state.byId,
          [data.id]: {
            ...state.byId[data.id],
            ...data
          }
        }
      }
    default:
      return state
  }
}

const usersReducer = combineReducers({
  items: itemsReducer,
  pagination: getPaginationReducer({
    ADD_PAGE: USERS_ADD_PAGE,
    REMOVE_PAGE: USERS_REMOVE_PAGE,
    REQUEST_PAGE: USERS_REQUEST_PAGE
  })
})

export default (state, action) => {
  if (action.type === USERS_PURGE_PAGINATION) {
    state.pagination = undefined
  }

  return usersReducer(state, action)
}
