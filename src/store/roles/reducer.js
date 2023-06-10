import { keyBy } from 'lodash-es'
import { emptyArray, emptyObject } from 'utils/defaults'
import * as ids from '../reducers/helpers/ids-reducers'
import { ROLE_BULK_ADD } from './index'

const initialState = {
  byId: emptyObject,
  allIds: emptyArray,
}

const usersReducer = (state = initialState, { type, data }) => {
  switch (type) {
    case ROLE_BULK_ADD:
      return {
        ...state,
        byId: {
          ...state.byId,
          ...keyBy(data.items, 'id'),
        },
        allIds: ids.addBulk(state.allIds, data),
      }
    default:
      return state
  }
}

export default usersReducer
