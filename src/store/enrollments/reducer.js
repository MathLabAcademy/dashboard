import { get, keyBy } from 'lodash-es'
import { emptyArray, emptyObject } from 'utils/defaults'
import { ENROLLMENT_UPDATE, ENROLLMENT_ADD, ENROLLMENT_BULK_ADD } from '.'
import * as ids from '../reducers/helpers/ids-reducers'

const initialState = {
  byId: emptyObject,
  allIds: emptyArray,
  enrollmentsById: emptyObject,
  cqExamsById: emptyObject,
  mcqExamsById: emptyObject,
}

const enrollmentsReducer = (state = initialState, { type, data }) => {
  switch (type) {
    case ENROLLMENT_ADD:
      return {
        ...state,
        byId: {
          ...state.byId,
          [data.id]: data,
        },
        allIds: ids.add(state.allIds, data),
      }
    case ENROLLMENT_BULK_ADD:
      return {
        ...state,
        byId: {
          ...state.byId,
          ...keyBy(data.items, 'id'),
        },
        allIds: ids.addBulk(state.allIds, data),
      }
    case ENROLLMENT_UPDATE:
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

export default enrollmentsReducer
