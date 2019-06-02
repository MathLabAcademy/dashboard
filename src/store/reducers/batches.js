import { get, groupBy, keyBy, mapValues, pickBy } from 'lodash-es'
import { combineReducers } from 'redux'
import {
  BATCHCLASS_ADD,
  BATCHCLASS_BULK_ADD,
  BATCHCLASS_REMOVE,
  BATCHCLASS_UPDATE,
  BATCHFEE_ADD,
  BATCHFEE_BULK_ADD,
  BATCHPAYMENT_ADD,
  BATCHPAYMENT_BULK_ADD,
  BATCHPAYMENT_REMOVE,
  BATCHPAYMENT_UPDATE,
  BATCHSTUDENT_ADD,
  BATCHSTUDENT_BULK_ADD,
  BATCHSTUDENT_NEXT_ID_SET,
  BATCHSTUDENT_REMOVE,
  BATCHSTUDENT_UPDATE
} from 'store/actions/actionTypes.js'
import { emptyArray, emptyObject } from 'utils/defaults.js'
import * as ids from './helpers/ids-reducers.js'

const initialClassesState = {
  byId: emptyObject,
  allIds: emptyArray,
  feesById: emptyObject
}

const batchClassesReducer = (state = initialClassesState, { type, data }) => {
  switch (type) {
    case BATCHCLASS_ADD:
      return {
        ...state,
        byId: {
          ...state.byId,
          [data.id]: {
            ...data
          }
        },
        allIds: ids.add(state.allIds, data)
      }
    case BATCHCLASS_BULK_ADD:
      return {
        ...state,
        byId: {
          ...state.byId,
          ...keyBy(data.items, 'id')
        },
        allIds: ids.addBulk(state.allIds, data)
      }
    case BATCHCLASS_REMOVE:
      return {
        ...state,
        byId: pickBy(state.byId, ({ id }) => id !== data.id),
        allIds: ids.remove(state.allIds, data)
      }
    case BATCHCLASS_UPDATE:
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
    case BATCHFEE_ADD:
      return {
        ...state,
        feesById: {
          ...state.feesById,
          [data.batchClassId]: {
            ...get(state.feesById, data.batchClassId, emptyObject),
            [data.year]: {
              ...get(
                state.feesById,
                [data.batchClassId, data.year],
                emptyObject
              ),
              [data.month]: {
                ...data
              }
            }
          }
        }
      }
    case BATCHFEE_BULK_ADD:
      return {
        ...state,
        feesById: {
          ...state.feesById,
          ...mapValues(
            groupBy(data.items, 'batchClassId'),
            (items, batchClassId) => ({
              ...get(state.feesById, batchClassId, emptyObject),
              ...mapValues(groupBy(items, 'year'), (items, year) => ({
                ...get(state.feesById, [batchClassId, year], emptyObject),
                ...keyBy(items, 'month')
              }))
            })
          )
        }
      }
    default:
      return state
  }
}

const initialStudentsState = {
  byId: emptyObject,
  allIds: emptyArray,
  paymentIdsById: emptyObject,
  nextId: { id: 0, query: '' }
}

const batchStudentsReducer = (
  state = initialStudentsState,
  { type, data, query }
) => {
  switch (type) {
    case BATCHSTUDENT_ADD:
      return {
        ...state,
        byId: {
          ...state.byId,
          [data.id]: {
            ...data
          }
        },
        allIds: ids.add(state.allIds, data)
      }
    case BATCHSTUDENT_BULK_ADD:
      return {
        ...state,
        byId: {
          ...state.byId,
          ...keyBy(data.items, 'id')
        },
        allIds: ids.addBulk(state.allIds, data)
      }
    case BATCHSTUDENT_REMOVE:
      return {
        ...state,
        byId: pickBy(state.byId, ({ id }) => id !== data.id),
        allIds: ids.remove(state.allIds, data)
      }
    case BATCHSTUDENT_UPDATE:
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
    case BATCHPAYMENT_ADD:
      return {
        ...state,
        paymentIdsById: {
          ...state.paymentIdsById,
          [data.batchStudentId]: ids.add(
            get(state.paymentIdsById, data.batchStudentId),
            data
          )
        }
      }
    case BATCHPAYMENT_BULK_ADD:
      return {
        ...state,
        paymentIdsById: {
          ...state.paymentIdsById,
          ...mapValues(
            groupBy(data.items, 'batchStudentId'),
            (items, batchStudentId) =>
              ids.addBulk(get(state.paymentIdsById, batchStudentId), { items })
          )
        }
      }
    case BATCHSTUDENT_NEXT_ID_SET:
      return {
        ...state,
        nextId: {
          id: data,
          query
        }
      }
    default:
      return state
  }
}

const initialPaymentsState = {
  byId: emptyObject,
  allIds: emptyArray
}

const batchPaymentsReducer = (state = initialPaymentsState, { type, data }) => {
  switch (type) {
    case BATCHPAYMENT_ADD:
      return {
        ...state,
        byId: {
          ...state.byId,
          [data.id]: {
            ...data
          }
        },
        allIds: ids.add(state.allIds, data)
      }
    case BATCHPAYMENT_BULK_ADD:
      return {
        ...state,
        byId: {
          ...state.byId,
          ...keyBy(data.items, 'id')
        },
        allIds: ids.addBulk(state.allIds, data)
      }
    case BATCHPAYMENT_REMOVE:
      return {
        ...state,
        byId: pickBy(state.byId, ({ id }) => id !== data.id),
        allIds: ids.remove(state.allIds, data)
      }
    case BATCHPAYMENT_UPDATE:
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
    default:
      return state
  }
}

export default combineReducers({
  classes: batchClassesReducer,
  payments: batchPaymentsReducer,
  students: batchStudentsReducer
})
