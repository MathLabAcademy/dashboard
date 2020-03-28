import { get, keyBy, pickBy } from 'lodash-es'
import {
  COURSETAG_ADD,
  COURSETAG_BULK_ADD,
  COURSETAG_REMOVE,
  COURSETAG_UPDATE,
} from 'store/actions/actionTypes'
import { emptyArray, emptyObject } from 'utils/defaults'
import * as ids from './helpers/ids-reducers'

const initialState = {
  byId: emptyObject,
  allIds: emptyArray,
}

const courseTagsReducer = (state = initialState, { type, data }) => {
  switch (type) {
    case COURSETAG_ADD:
      return {
        ...state,
        byId: {
          ...state.byId,
          [data.id]: data,
        },
        allIds: ids.add(state.allIds, data),
      }
    case COURSETAG_BULK_ADD:
      return {
        ...state,
        byId: {
          ...state.byId,
          ...keyBy(data.items, 'id'),
        },
        allIds: ids.addBulk(state.allIds, data),
      }
    case COURSETAG_REMOVE:
      return {
        ...state,
        byId: pickBy(state.byId, ({ id }) => id !== data.id),
        allIds: ids.remove(state.allIds, data),
      }
    case COURSETAG_UPDATE:
      return {
        ...state,
        byId: {
          ...state.byId,
          [data.id]: {
            ...get(state.byId, data.id, emptyObject),
            ...data,
          },
        },
      }
    default:
      return state
  }
}

export default courseTagsReducer
