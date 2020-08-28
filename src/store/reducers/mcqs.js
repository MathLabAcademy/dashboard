import { get, groupBy, keyBy, mapValues } from 'lodash-es'
import {
  MCQANSWER_ADD,
  MCQANSWER_BULK_ADD,
  MCQIMAGE_ADD,
  MCQIMAGE_BULK_ADD,
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

const mcqsReducer = (state = initialState, { type, data, mcqId }) => {
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
        byId: {
          ...state.byId,
          [mcqId]: {
            ...get(state.byId, mcqId, emptyObject),
            deleted: true,
          },
        },
        allIds: ids.remove(state.allIds, { id: mcqId }),
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
          [data.mapId]: {
            ...get(state.imagesById, data.mapId, emptyObject),
            [data.s3ObjectId]: {
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
          ...mapValues(groupBy(data.items, 'mapId'), (items, mcqId) => ({
            ...get(state.imagesById, mcqId, emptyObject),
            ...keyBy(items, 's3ObjectId'),
          })),
        },
      }
    default:
      return state
  }
}

export default mcqsReducer
