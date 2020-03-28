import { get, groupBy, keyBy, map, mapValues, pickBy, union } from 'lodash-es'
import {
  MCQANSWER_ADD,
  MCQANSWER_BULK_ADD,
  MCQIMAGE_ADD,
  MCQIMAGE_BULK_ADD,
  MCQIMAGE_TMP_ADD,
  MCQIMAGE_TMP_BULK_ADD,
  MCQ_ADD,
  MCQ_BULK_ADD,
  MCQ_REMOVE,
  MCQ_UPDATE,
} from 'store/actions/actionTypes'
import { emptyArray, emptyObject } from 'utils/defaults'
import * as ids from './helpers/ids-reducers'

const initialState = {
  byId: emptyObject,
  allIds: emptyArray,
  answerById: emptyObject,
  imagesById: {
    tmp: [],
  },
}

const mcqsReducer = (state = initialState, { type, data }) => {
  switch (type) {
    case MCQ_ADD:
      return {
        ...state,
        byId: {
          ...state.byId,
          [data.id]: data,
        },
        allIds: ids.add(state.allIds, data),
      }
    case MCQ_BULK_ADD:
      return {
        ...state,
        byId: {
          ...state.byId,
          ...keyBy(data.items, 'id'),
        },
        allIds: ids.addBulk(state.allIds, data),
      }
    case MCQ_REMOVE:
      return {
        ...state,
        byId: pickBy(state.byId, ({ id }) => id !== data.id),
        allIds: ids.remove(state.allIds, data),
      }
    case MCQ_UPDATE:
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
    case MCQANSWER_ADD:
      return {
        ...state,
        answerById: {
          ...state.answerById,
          [data.mcqId]: data.mcqOptionId,
        },
      }
    case MCQANSWER_BULK_ADD:
      return {
        ...state,
        answerById: {
          ...state.answerById,
          ...mapValues(keyBy(data.items, 'mcqId'), 'mcqOptionId'),
        },
      }
    case MCQIMAGE_ADD:
      return {
        ...state,
        imagesById: {
          ...state.imagesById,
          [data.mcqId]: {
            ...get(state.imagesById, data.mcqId, emptyObject),
            [data.serial]: {
              ...data,
            },
          },
        },
      }
    case MCQIMAGE_BULK_ADD:
      return {
        ...state,
        imagesById: {
          ...state.imagesById,
          ...mapValues(groupBy(data.items, 'mcqId'), (items, mcqId) => ({
            ...get(state.imagesById, mcqId, emptyObject),
            ...keyBy(items, 'serial'),
          })),
        },
      }
    case MCQIMAGE_TMP_ADD:
      return {
        ...state,
        imagesById: {
          ...state.imagesById,
          tmp: union(state.imagesById.tmp, [data.filePath]),
        },
      }
    case MCQIMAGE_TMP_BULK_ADD:
      return {
        ...state,
        imagesById: {
          ...state.imagesById,
          tmp: map(data.items, 'filePath'),
        },
      }
    default:
      return state
  }
}

export default mcqsReducer
