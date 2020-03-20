import { keyBy } from 'lodash-es'
import { TRANSACTION_BULK_ADD } from 'store/actions/actionTypes'
import { emptyArray, emptyObject } from 'utils/defaults'
import * as ids from './helpers/ids-reducers'

const initialState = {
  byId: emptyObject,
  allIds: emptyArray
}

const transactionsReducer = (state = initialState, { type, data }) => {
  switch (type) {
    case TRANSACTION_BULK_ADD:
      return {
        ...state,
        byId: {
          ...state.byId,
          ...keyBy(data.items, 'id')
        },
        allIds: ids.addBulk(state.allIds, data)
      }
    default:
      return state
  }
}

export default transactionsReducer
