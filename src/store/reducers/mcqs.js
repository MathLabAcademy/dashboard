import { get, keyBy, pickBy, mapValues } from 'lodash-es'
import {
  MCQ_ADD,
  MCQ_BULK_ADD,
  MCQ_REMOVE,
  MCQ_UPDATE,
  MCQANSWER_BULK_ADD
} from 'store/actions/actionTypes.js'
import { emptyArray, emptyObject } from 'utils/defaults.js'
import * as ids from './helpers/ids-reducers.js'

const initialState = {
  byId: emptyObject,
  allIds: emptyArray,
  answerById: emptyObject
}

const mcqExamsReducer = (state = initialState, { type, data }) => {
  switch (type) {
    case MCQ_ADD:
      return {
        ...state,
        byId: {
          ...state.byId,
          [data.id]: data
        },
        allIds: ids.add(state.allIds, data)
      }
    case MCQ_BULK_ADD:
      return {
        ...state,
        byId: {
          ...state.byId,
          ...keyBy(data.items, 'id')
        },
        allIds: ids.addBulk(state.allIds, data)
      }
    case MCQ_REMOVE:
      return {
        ...state,
        byId: pickBy(state.byId, id => id !== data.id),
        allIds: ids.remove(state.allIds, data)
      }
    case MCQ_UPDATE:
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
    case MCQANSWER_BULK_ADD:
      return {
        ...state,
        answerById: {
          ...state.answerById,
          ...mapValues(keyBy(data.items, 'mcqId'), 'mcqOptionId')
        }
      }
    default:
      return state
  }
}

export default mcqExamsReducer
