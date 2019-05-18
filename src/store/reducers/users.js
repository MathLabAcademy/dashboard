import { get, groupBy, keyBy, map, mapValues, pickBy, union } from 'lodash-es'
import {
  ENROLLMENT_BULK_ADD,
  USER_ADD,
  USER_BULK_ADD,
  USER_REMOVE,
  USER_UPDATE,
  ENROLLMENT_ADD,
  MCQEXAMTRACKER_UPDATE
} from 'store/actions/actionTypes.js'
import { emptyArray, emptyObject } from 'utils/defaults.js'
import * as ids from './helpers/ids-reducers.js'

const initialState = {
  byId: emptyObject,
  allIds: emptyArray,
  enrollmentsById: emptyObject,
  mcqExamTrackersById: emptyObject
}

const usersReducer = (state = initialState, { type, id, data }) => {
  switch (type) {
    case USER_ADD:
      return {
        ...state,
        byId: {
          ...state.byId,
          [data.id]: data
        },
        allIds: ids.add(state.allIds, data)
      }
    case USER_BULK_ADD:
      return {
        ...state,
        byId: {
          ...state.byId,
          ...keyBy(data.items, 'id')
        },
        allIds: ids.addBulk(state.allIds, data)
      }
    case USER_REMOVE:
      return {
        ...state,
        byId: pickBy(state.byId, i => i !== id),
        allIds: ids.remove(state.allIds, id)
      }
    case USER_UPDATE:
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
    case ENROLLMENT_ADD:
      return {
        ...state,
        enrollmentsById: {
          ...state.enrollmentsById,
          [data.userId]: union(
            get(state.enrollmentsById, data.userId, emptyArray),
            [data.courseId]
          )
        }
      }
    case ENROLLMENT_BULK_ADD:
      return {
        ...state,
        enrollmentsById: {
          ...state.enrollmentsById,
          ...mapValues(groupBy(data.items, 'userId'), (items, userId) =>
            union(
              get(state.enrollmentsById, userId, emptyArray),
              map(items, 'courseId')
            )
          )
        }
      }
    case MCQEXAMTRACKER_UPDATE:
      return {
        ...state,
        mcqExamTrackersById: {
          ...state.enrollmentsById
        }
      }
    default:
      return state
  }
}

export default usersReducer
