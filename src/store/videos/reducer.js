import { get, keyBy, pickBy } from 'lodash-es'
import {
  VIDEO_ADD,
  VIDEO_BULK_ADD,
  VIDEO_REMOVE,
  VIDEO_UPDATE,
} from 'store/videos'
import { emptyArray, emptyObject } from 'utils/defaults'
import * as ids from '../reducers/helpers/ids-reducers'

const initialState = {
  byId: emptyObject,
  allIds: emptyArray,
}

const videosReducer = (state = initialState, { type, data, videoId }) => {
  switch (type) {
    case VIDEO_ADD:
      return {
        ...state,
        byId: {
          ...state.byId,
          [data.id]: data,
        },
        allIds: ids.add(state.allIds, data),
      }
    case VIDEO_BULK_ADD:
      return {
        ...state,
        byId: {
          ...state.byId,
          ...keyBy(data.items, 'id'),
        },
        allIds: ids.addBulk(state.allIds, data),
      }
    case VIDEO_REMOVE:
      return {
        ...state,
        byId: pickBy(state.byId, ({ id }) => id !== videoId),
        allIds: ids.remove(state.allIds, data),
      }
    case VIDEO_UPDATE:
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

export default videosReducer
