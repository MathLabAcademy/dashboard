import { get, groupBy, keyBy, mapValues, pickBy } from 'lodash-es'
import {
  BATCHCLASSENROLLMENT_BULK_ADD,
  BATCHCOURSEENROLLMENT_BULK_ADD,
  ENROLLMENT_ADD,
  ENROLLMENT_BULK_ADD,
  MCQEXAMTRACKER_UPDATE,
  USER_ADD,
  USER_BULK_ADD,
  USER_REMOVE,
  USER_UPDATE
} from 'store/actions/actionTypes'
import { emptyArray, emptyObject } from 'utils/defaults'
import * as ids from './helpers/ids-reducers'

const initialState = {
  byId: emptyObject,
  allIds: emptyArray,
  batchClassEnrollmentsById: emptyObject,
  batchCourseEnrollmentsById: emptyObject,
  courseEnrollmentsById: emptyObject,
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
    case BATCHCLASSENROLLMENT_BULK_ADD:
      return {
        ...state,
        batchClassEnrollmentsById: {
          ...state.batchClassEnrollmentsById,
          ...mapValues(groupBy(data.items, 'userId'), (items, userId) => ({
            ...get(state.batchClassEnrollmentsById, userId),
            ...keyBy(items, 'id')
          }))
        }
      }
    case BATCHCOURSEENROLLMENT_BULK_ADD:
      return {
        ...state,
        batchCourseEnrollmentsById: {
          ...state.batchCourseEnrollmentsById,
          ...mapValues(groupBy(data.items, 'userId'), (items, userId) => ({
            ...get(state.batchCourseEnrollmentsById, userId),
            ...keyBy(items, 'id')
          }))
        }
      }
    case ENROLLMENT_ADD:
      return {
        ...state,
        courseEnrollmentsById: {
          ...state.courseEnrollmentsById,
          [data.userId]: {
            ...get(state.courseEnrollmentsById, data.userId),
            [data.courseId]: {
              ...data
            }
          }
        }
      }
    case ENROLLMENT_BULK_ADD:
      return {
        ...state,
        courseEnrollmentsById: {
          ...state.courseEnrollmentsById,
          ...mapValues(groupBy(data.items, 'userId'), (items, userId) => ({
            ...get(state.courseEnrollmentsById, userId),
            ...keyBy(items, 'courseId')
          }))
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
