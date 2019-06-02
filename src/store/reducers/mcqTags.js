import { get, keyBy, pickBy } from 'lodash-es'
import {
  MCQTAG_ADD,
  MCQTAG_BULK_ADD,
  MCQTAG_REMOVE,
  MCQTAG_UPDATE
} from 'store/actions/actionTypes.js'
import { emptyArray, emptyObject } from 'utils/defaults.js'
import * as ids from './helpers/ids-reducers.js'

const initialState = {
  byId: emptyObject,
  allIds: emptyArray
}

const mcqTagsReducer = (state = initialState, { type, data }) => {
  switch (type) {
    case MCQTAG_ADD:
      return {
        ...state,
        byId: {
          ...state.byId,
          [data.id]: data
        },
        allIds: ids.add(state.allIds, data)
      }
    case MCQTAG_BULK_ADD:
      return {
        ...state,
        byId: {
          ...state.byId,
          ...keyBy(data.items, 'id')
        },
        allIds: ids.addBulk(state.allIds, data)
      }
    case MCQTAG_REMOVE:
      return {
        ...state,
        byId: pickBy(state.byId, ({ id }) => id !== data.id),
        allIds: ids.remove(state.allIds, data)
      }
    case MCQTAG_UPDATE:
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

export default mcqTagsReducer
