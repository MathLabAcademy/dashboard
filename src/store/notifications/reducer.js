import { keyBy } from 'lodash-es'
import {
  NOTIFICATION_WEB_ADD,
  NOTIFICATION_WEB_BULK_ADD,
  NOTIFICATION_WEB_UPDATE,
} from 'store/notifications'
import * as ids from 'store/reducers/helpers/ids-reducers'
import { emptyArray, emptyObject } from 'utils/defaults'
import { combineReducers } from 'redux'

const initialState = {
  byId: emptyObject,
  allIds: emptyArray,
}

const webNotificationsReducer = (
  state = initialState,
  { type, data, notificationId }
) => {
  switch (type) {
    case NOTIFICATION_WEB_ADD:
      return {
        ...state,
        byId: {
          ...state.byId,
          [data.id]: {
            ...data,
          },
        },
        allIds: ids.add(state.allIds, data),
      }
    case NOTIFICATION_WEB_BULK_ADD:
      return {
        ...state,
        byId: {
          ...state.byId,
          ...keyBy(data.items, 'id'),
        },
        allIds: ids.addBulk(state.allIds, data),
      }
    case NOTIFICATION_WEB_UPDATE:
      return {
        ...state,
        byId: {
          ...state.byId,
          [notificationId]: {
            ...state.byId[notificationId],
            ...data,
          },
        },
      }
    default:
      return state
  }
}

const notificationsReducer = combineReducers({
  web: webNotificationsReducer,
})

export default notificationsReducer
