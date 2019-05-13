import { get, keyBy, pickBy } from 'lodash-es'
import {
  COURSE_ADD,
  COURSE_BULK_ADD,
  COURSE_REMOVE,
  COURSE_UPDATE
} from 'store/actions/actionTypes.js'
import { emptyArray, emptyObject } from 'utils/defaults.js'
import * as ids from './helpers/ids-reducers.js'

const initialState = { byId: emptyObject, allIds: emptyArray }

const coursesReducer = (state = initialState, { type, data }) => {
  switch (type) {
    case COURSE_ADD:
      return {
        ...state,
        byId: {
          ...state.byId,
          [data.id]: data
        },
        allIds: ids.add(state.allIds, data)
      }
    case COURSE_BULK_ADD:
      return {
        ...state,
        byId: {
          ...state.byId,
          ...keyBy(data.items, 'id')
        },
        allIds: ids.addBulk(state.allIds, data)
      }
    case COURSE_REMOVE:
      return {
        ...state,
        byId: pickBy(state.byId, id => id !== data.id),
        allIds: ids.remove(state.allIds, data)
      }
    case COURSE_UPDATE:
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

export default coursesReducer
