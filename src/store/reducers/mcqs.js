import { get, keyBy, mapValues, pickBy } from 'lodash-es'
import {
  MCQANSWER_ADD,
  MCQANSWER_BULK_ADD,
  MCQ_ADD,
  MCQ_BULK_ADD,
  MCQ_REMOVE,
  MCQ_UPDATE
} from 'store/actions/actionTypes.js'
import { emptyArray, emptyObject } from 'utils/defaults.js'
import * as ids from './helpers/ids-reducers.js'

const initialState = {
  byId: emptyObject,
  allIds: emptyArray,
  answerById: emptyObject
}

const mcqsReducer = (state = initialState, { type, data }) => {
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
        byId: pickBy(state.byId, ({ id }) => id !== data.id),
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
    case MCQANSWER_ADD:
      return {
        ...state,
        answerById: {
          ...state.answerById,
          [data.mcqId]: data.mcqOptionId
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

export default mcqsReducer
