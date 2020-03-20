import { get, groupBy, keyBy, map, mapValues, pickBy, union } from 'lodash-es'
import {
  COURSE_ADD,
  COURSE_BULK_ADD,
  COURSE_REMOVE,
  COURSE_UPDATE,
  CQEXAM_ADD,
  CQEXAM_BULK_ADD,
  ENROLLMENT_ADD,
  ENROLLMENT_BULK_ADD,
  MCQEXAM_ADD,
  MCQEXAM_BULK_ADD
} from 'store/actions/actionTypes'
import { emptyArray, emptyObject } from 'utils/defaults'
import * as ids from './helpers/ids-reducers'

const initialState = {
  byId: emptyObject,
  allIds: emptyArray,
  enrollmentsById: emptyObject,
  cqExamsById: emptyObject,
  mcqExamsById: emptyObject
}

const coursesReducer = (state = initialState, { type, data }) => {
  switch (type) {
    case COURSE_ADD:
      return {
        ...state,
        byId: {
          ...state.byId,
          [data.id]: data
        },
        allIds: ids.add(state.allIds, data)
      }
    case COURSE_BULK_ADD:
      return {
        ...state,
        byId: {
          ...state.byId,
          ...keyBy(data.items, 'id')
        },
        allIds: ids.addBulk(state.allIds, data)
      }
    case COURSE_REMOVE:
      return {
        ...state,
        byId: pickBy(state.byId, ({ id }) => id !== data.id),
        allIds: ids.remove(state.allIds, data)
      }
    case COURSE_UPDATE:
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
          [data.courseId]: union(
            get(state.enrollmentsById, data.courseId, emptyArray),
            [data.userId]
          )
        }
      }
    case ENROLLMENT_BULK_ADD:
      return {
        ...state,
        enrollmentsById: {
          ...state.enrollmentsById,
          ...mapValues(groupBy(data.items, 'courseId'), (items, courseId) =>
            union(
              get(state.enrollmentsById, courseId, emptyArray),
              map(items, 'userId')
            )
          )
        }
      }
    case CQEXAM_ADD:
      return {
        ...state,
        cqExamsById: {
          ...state.cqExamsById,
          [data.courseId]: union(
            get(state.cqExamsById, data.courseId, emptyArray),
            [data.id]
          )
        }
      }
    case CQEXAM_BULK_ADD:
      return {
        ...state,
        cqExamsById: {
          ...state.cqExamsById,
          ...mapValues(groupBy(data.items, 'courseId'), items =>
            map(items, 'id')
          )
        }
      }
    case MCQEXAM_ADD:
      return {
        ...state,
        mcqExamsById: {
          ...state.mcqExamsById,
          [data.courseId]: union(
            get(state.mcqExamsById, data.courseId, emptyArray),
            [data.id]
          )
        }
      }
    case MCQEXAM_BULK_ADD:
      return {
        ...state,
        mcqExamsById: {
          ...state.mcqExamsById,
          ...mapValues(groupBy(data.items, 'courseId'), items =>
            map(items, 'id')
          )
        }
      }
    default:
      return state
  }
}

export default coursesReducer
