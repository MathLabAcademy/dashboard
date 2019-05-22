import { get, keyBy, pickBy, union, map, mapValues, groupBy } from 'lodash-es'
import {
  MCQEXAMQUESTION_ADD,
  MCQEXAMQUESTION_BULK_ADD,
  MCQEXAMTRACKER_UPDATE,
  MCQEXAM_ADD,
  MCQEXAM_BULK_ADD,
  MCQEXAM_REMOVE,
  MCQEXAM_UPDATE
} from 'store/actions/actionTypes.js'
import { emptyArray, emptyObject } from 'utils/defaults.js'
import * as ids from './helpers/ids-reducers.js'

const initialState = {
  byId: emptyObject,
  allIds: emptyArray,
  trackersById: emptyObject,
  questionsById: emptyObject
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
    case MCQEXAMQUESTION_ADD:
      return {
        ...state,
        questionsById: {
          ...state.questionsById,
          [data.mcqExamId]: union(
            get(state.questionsById, data.mcqExamId, emptyArray),
            [data.mcqId]
          )
        }
      }
    case MCQEXAMQUESTION_BULK_ADD:
      return {
        ...state,
        questionsById: {
          ...state.questionsById,
          ...mapValues(groupBy(data.items, 'mcqExamId'), (items, mcqExamId) =>
            union(
              get(state.questionsById, mcqExamId, emptyArray),
              map(items, 'mcqId')
            )
          )
        }
      }
    case MCQEXAMTRACKER_UPDATE:
      return {
        ...state,
        trackersById: {
          ...state.trackersById,
          [data.mcqExamId]: {
            ...get(state.trackersById, data.mcqExamId, emptyObject),
            [data.userId]: {
              ...data
            }
          }
        }
      }
    default:
      return state
  }
}

export default mcqExamsReducer
