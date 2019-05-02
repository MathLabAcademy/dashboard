import { get, keyBy, pickBy } from 'lodash-es'
import {
  USER_ADD,
  USER_BULK_ADD,
  USER_REMOVE,
  USER_UPDATE
} from 'store/actions/actionTypes.js'
import { emptyArray, emptyObject } from 'utils/defaults.js'
import * as allIds from './helpers/allIds-reducers.js'

const initialState = { byId: emptyObject, allIds: emptyArray }

const usersReducer = (state = initialState, { type, data, id }) => {
  switch (type) {
    case USER_ADD:
      return {
        ...state,
        byId: {
          ...state.byId,
          [data.id]: data
        },
        allIds: allIds.add(state.allIds, data)
      }
    case USER_BULK_ADD:
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
            ...get(state.byId, data.id, emptyObject),
            ...data
          }
        }
      }
    default:
      return state
  }
}

export default usersReducer
