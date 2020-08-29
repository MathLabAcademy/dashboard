import { get, keyBy, pickBy } from 'lodash-es'
import {
  CQEXAM_ADD,
  CQEXAM_BULK_ADD,
  CQEXAM_REMOVE,
  CQEXAM_UPDATE,
} from './index'
import { emptyArray, emptyObject } from 'utils/defaults'
import * as ids from '../reducers/helpers/ids-reducers'

const initialState = {
  byId: emptyObject,
  allIds: emptyArray,
}

const cqExamsReducer = (state = initialState, { type, data }) => {
  switch (type) {
    case CQEXAM_ADD:
      return {
        ...state,
        byId: {
          ...state.byId,
          [data.id]: data,
        },
        allIds: ids.add(state.allIds, data),
      }
    case CQEXAM_BULK_ADD:
      return {
        ...state,
        byId: {
          ...state.byId,
          ...keyBy(data.items, 'id'),
        },
        allIds: ids.addBulk(state.allIds, data),
      }
    case CQEXAM_REMOVE:
      return {
        ...state,
        byId: pickBy(state.byId, ({ id }) => id !== data.id),
        allIds: ids.remove(state.allIds, data),
      }
    case CQEXAM_UPDATE:
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

export default cqExamsReducer
