import { keyBy } from 'lodash-es'
import { TRANSACTION_BULK_ADD } from 'store/actions/actionTypes.js'
import { emptyArray, emptyObject } from 'utils/defaults.js'
import * as ids from './helpers/ids-reducers.js'

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
