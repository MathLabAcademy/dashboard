import { get, groupBy, keyBy, map, mapValues, pickBy, union } from 'lodash-es'
import { MCQEXAM_ADD, MCQEXAM_BULK_ADD } from 'store/actions/actionTypes'
import { CQEXAM_ADD, CQEXAM_BULK_ADD } from 'store/cqExams'
import {
  COURSE_ADD,
  COURSE_BULK_ADD,
  COURSE_REMOVE,
  COURSE_UPDATE,
  COURSE_VIDEO_ADD,
  COURSE_VIDEO_BULK_ADD,
  COURSE_VIDEO_REMOVE,
} from 'store/courses'
import { ENROLLMENT_ADD, ENROLLMENT_BULK_ADD } from 'store/enrollments'
import { emptyArray, emptyObject } from 'utils/defaults'
import * as ids from '../reducers/helpers/ids-reducers'

const initialState = {
  byId: emptyObject,
  allIds: emptyArray,
  enrollmentsById: emptyObject,
  cqExamsById: emptyObject,
  mcqExamsById: emptyObject,
  videosById: emptyObject,
}

const coursesReducer = (
  state = initialState,
  { type, data, courseId, videoId }
) => {
  switch (type) {
    case COURSE_ADD:
      return {
        ...state,
        byId: {
          ...state.byId,
          [data.id]: data,
        },
        allIds: ids.add(state.allIds, data),
      }
    case COURSE_BULK_ADD:
      return {
        ...state,
        byId: {
          ...state.byId,
          ...keyBy(data.items, 'id'),
        },
        allIds: ids.addBulk(state.allIds, data),
      }
    case COURSE_REMOVE:
      return {
        ...state,
        byId: pickBy(state.byId, ({ id }) => id !== data.id),
        allIds: ids.remove(state.allIds, data),
      }
    case COURSE_UPDATE:
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
    case ENROLLMENT_ADD:
      return {
        ...state,
        enrollmentsById: {
          ...state.enrollmentsById,
          [data.courseId]: union(
            get(state.enrollmentsById, data.courseId, emptyArray),
            [data.userId]
          ),
        },
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
          ),
        },
      }
    case CQEXAM_ADD:
      return {
        ...state,
        cqExamsById: {
          ...state.cqExamsById,
          [data.courseId]: union(
            get(state.cqExamsById, data.courseId, emptyArray),
            [data.id]
          ),
        },
      }
    case CQEXAM_BULK_ADD:
      return {
        ...state,
        cqExamsById: {
          ...state.cqExamsById,
          ...mapValues(groupBy(data.items, 'courseId'), (items) =>
            map(items, 'id')
          ),
        },
      }
    case MCQEXAM_ADD:
      return {
        ...state,
        mcqExamsById: {
          ...state.mcqExamsById,
          [data.courseId]: union(
            get(state.mcqExamsById, data.courseId, emptyArray),
            [data.id]
          ),
        },
      }
    case MCQEXAM_BULK_ADD:
      return {
        ...state,
        mcqExamsById: {
          ...state.mcqExamsById,
          ...mapValues(groupBy(data.items, 'courseId'), (items) =>
            map(items, 'id')
          ),
        },
      }
    case COURSE_VIDEO_ADD:
      return {
        ...state,
        videosById: {
          ...state.videosById,
          [data.courseId]: ids.add(
            get(state.videosById, data.courseId, emptyArray),
            { id: data.videoId }
          ),
        },
      }
    case COURSE_VIDEO_BULK_ADD:
      return {
        ...state,
        videosById: {
          ...state.videosById,
          ...mapValues(groupBy(data.items, 'courseId'), (items) =>
            map(items, 'videoId')
          ),
        },
      }
    case COURSE_VIDEO_REMOVE:
      return {
        ...state,
        videosById: {
          ...state.videosById,
          [courseId]: ids.remove(get(state.videosById, courseId), {
            id: videoId,
          }),
        },
      }
    default:
      return state
  }
}

export default coursesReducer
