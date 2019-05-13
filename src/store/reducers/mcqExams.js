import { get, keyBy, pickBy } from 'lodash-es'
import {
  MCQEXAM_ADD,
  MCQEXAM_BULK_ADD,
  MCQEXAM_REMOVE,
  MCQEXAM_UPDATE
} from 'store/actions/actionTypes.js'
import { emptyArray, emptyObject } from 'utils/defaults.js'
import * as ids from './helpers/ids-reducers.js'

const initialState = {
  byId: emptyObject,
  allIds: emptyArray
}

const mcqExamsReducer = (state = initialState, { type, data }) => {
  switch (type) {
    case MCQEXAM_ADD:
      return {
        ...state,
        byId: {
          ...state.byId,
          [data.id]: data
        },
        allIds: ids.add(state.allIds, data)
      }
    case MCQEXAM_BULK_ADD:
      return {
        ...state,
        byId: {
          ...state.byId,
          ...keyBy(data.items, 'id')
        },
        allIds: ids.addBulk(state.allIds, data)
      }
    case MCQEXAM_REMOVE:
      return {
        ...state,
        byId: pickBy(state.byId, id => id !== data.id),
        allIds: ids.remove(state.allIds, data)
      }
    case MCQEXAM_UPDATE:
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

export default mcqExamsReducer
