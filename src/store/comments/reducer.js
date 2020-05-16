import { get, groupBy, keyBy, mapValues } from 'lodash-es'
import {
  COMMENT_ADD,
  COMMENT_BULK_ADD,
  COMMENT_SUBSCRIBE,
  COMMENT_UNSUBSCRIBE,
} from 'store/comments'
import * as ids from 'store/reducers/helpers/ids-reducers'
import { emptyArray, emptyObject } from 'utils/defaults'

const initialState = {
  byId: emptyObject,
  allIds: emptyArray,
  idsByThread: emptyObject,
}

const commentsReducer = (state = initialState, { type, data, commentId }) => {
  switch (type) {
    case COMMENT_ADD:
      return {
        ...state,
        byId: {
          ...state.byId,
          [data.id]: data,
          ...(data.parentId
            ? {
                [data.parentId]: {
                  ...get(state.byId, data.parentId, emptyObject),
                  childIds: ids.add(
                    get(state.byId[data.parentId], 'childIds', emptyArray),
                    data
                  ),
                },
              }
            : {}),
        },
        allIds: ids.add(state.allIds, data),
        idsByThread: {
          ...state.idsByThread,
          [data.thread]: ids.add(
            get(state.idsByThread, data.thread, emptyArray),
            data
          ),
        },
      }
    case COMMENT_BULK_ADD:
      return {
        ...state,
        byId: {
          ...state.byId,
          ...keyBy(data.items, 'id'),
        },
        allIds: ids.addBulk(state.allIds, data),
        idsByThread: {
          ...state.idsByThread,
          ...mapValues(groupBy(data.items, 'thread'), (items, thread) =>
            ids.addBulk(get(state.idsByThread, thread, emptyArray), { items })
          ),
        },
      }
    case COMMENT_SUBSCRIBE:
      return {
        ...state,
        byId: {
          ...state.byId,
          [commentId]: {
            ...state.byId[commentId],
            isSubscribed: true,
          },
        },
      }
    case COMMENT_UNSUBSCRIBE:
      return {
        ...state,
        byId: {
          ...state.byId,
          [commentId]: {
            ...state.byId[commentId],
            isSubscribed: false,
          },
        },
      }
    default:
      return state
  }
}

export default commentsReducer
