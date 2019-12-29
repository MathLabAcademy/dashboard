import { get, groupBy, keyBy, mapValues, pickBy } from 'lodash-es'
import { combineReducers } from 'redux'
import {
  BATCHCLASSENROLLMENT_ADD,
  BATCHCLASSENROLLMENT_BULK_ADD,
  BATCHCLASSENROLLMENT_NEXT_SERIAL_SET,
  BATCHCLASSENROLLMENT_REMOVE,
  BATCHCLASSENROLLMENT_UPDATE,
  BATCHCLASSFEE_ADD,
  BATCHCLASSFEE_BULK_ADD,
  BATCHCLASSFEE_REMOVE,
  BATCHCLASSPAYMENT_ADD,
  BATCHCLASSPAYMENT_BULK_ADD,
  BATCHCLASSPAYMENT_REMINDER_ADD,
  BATCHCLASSPAYMENT_REMINDER_SET_ALL,
  BATCHCLASSPAYMENT_REMOVE,
  BATCHCLASS_ADD,
  BATCHCLASS_BULK_ADD,
  BATCHCLASS_REMOVE,
  BATCHCLASS_UPDATE,
  BATCHCOURSEENROLLMENT_ADD,
  BATCHCOURSEENROLLMENT_BULK_ADD,
  BATCHCOURSEENROLLMENT_NEXT_SERIAL_SET,
  BATCHCOURSEENROLLMENT_REMOVE,
  BATCHCOURSEENROLLMENT_UPDATE,
  BATCHCOURSEPAYMENT_ADD,
  BATCHCOURSEPAYMENT_BULK_ADD,
  BATCHCOURSEPAYMENT_REMINDER_ADD,
  BATCHCOURSEPAYMENT_REMINDER_SET_ALL,
  BATCHCOURSEPAYMENT_REMOVE,
  BATCHCOURSE_ADD,
  BATCHCOURSE_BULK_ADD,
  BATCHCOURSE_REMOVE,
  BATCHCOURSE_UPDATE,
  // BATCHPAYMENT_ADD,
  // BATCHPAYMENT_BULK_ADD,
  // BATCHPAYMENT_REMOVE,
  // BATCHPAYMENT_UPDATE,
  BATCHSTUDENT_ADD,
  BATCHSTUDENT_BULK_ADD,
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

const batchClassesReducer = (
  state = initialClassesState,
  { type, data, params }
) => {
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
    case BATCHCLASSENROLLMENT_NEXT_SERIAL_SET:
      return {
        ...state,
        byId: {
          ...state.byId,
          [params.batchClassId]: {
            ...get(state.byId, params.batchClassId, emptyObject),
            nextSerials: {
              ...get(
                state.byId,
                [params.batchClassId, 'nextSerials'],
                emptyObject
              ),
              [params.year]: data
            }
          }
        }
      }
    case BATCHCLASSFEE_ADD:
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
    case BATCHCLASSFEE_BULK_ADD:
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
    case BATCHCLASSFEE_REMOVE:
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
              [data.month]: undefined
            }
          }
        }
      }
    default:
      return state
  }
}

const initialClassEnrollmentsState = {
  byId: emptyObject,
  allIds: emptyArray
}

const batchClassEnrollmentsReducer = (
  state = initialClassEnrollmentsState,
  { type, data }
) => {
  switch (type) {
    case BATCHCLASSENROLLMENT_ADD:
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
    case BATCHCLASSENROLLMENT_BULK_ADD:
      return {
        ...state,
        byId: {
          ...state.byId,
          ...keyBy(data.items, 'id')
        },
        allIds: ids.addBulk(state.allIds, data)
      }
    case BATCHCLASSENROLLMENT_REMOVE:
      return {
        ...state,
        byId: pickBy(state.byId, ({ id }) => id !== data.id),
        allIds: ids.remove(state.allIds, data)
      }
    case BATCHCLASSENROLLMENT_UPDATE:
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

const initialCoursesState = {
  byId: emptyObject,
  allIds: emptyArray
}

const batchCoursesReducer = (
  state = initialCoursesState,
  { type, data, params }
) => {
  switch (type) {
    case BATCHCOURSE_ADD:
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
    case BATCHCOURSE_BULK_ADD:
      return {
        ...state,
        byId: {
          ...state.byId,
          ...keyBy(data.items, 'id')
        },
        allIds: ids.addBulk(state.allIds, data)
      }
    case BATCHCOURSE_REMOVE:
      return {
        ...state,
        byId: pickBy(state.byId, ({ id }) => id !== data.id),
        allIds: ids.remove(state.allIds, data)
      }
    case BATCHCOURSE_UPDATE:
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
    case BATCHCOURSEENROLLMENT_NEXT_SERIAL_SET:
      return {
        ...state,
        byId: {
          ...state.byId,
          [params.batchCourseId]: {
            ...get(state.byId, params.batchCourseId, emptyObject),
            nextSerials: {
              ...get(
                state.byId,
                [params.batchCourseId, 'nextSerials'],
                emptyObject
              ),
              [params.year]: data
            }
          }
        }
      }
    default:
      return state
  }
}

const initialCourseEnrollmentsState = {
  byId: emptyObject,
  allIds: emptyArray
}

const batchCourseEnrollmentsReducer = (
  state = initialCourseEnrollmentsState,
  { type, data }
) => {
  switch (type) {
    case BATCHCOURSEENROLLMENT_ADD:
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
    case BATCHCOURSEENROLLMENT_BULK_ADD:
      return {
        ...state,
        byId: {
          ...state.byId,
          ...keyBy(data.items, 'id')
        },
        allIds: ids.addBulk(state.allIds, data)
      }
    case BATCHCOURSEENROLLMENT_REMOVE:
      return {
        ...state,
        byId: pickBy(state.byId, ({ id }) => id !== data.id),
        allIds: ids.remove(state.allIds, data)
      }
    case BATCHCOURSEENROLLMENT_UPDATE:
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

const initialStudentsState = {
  byId: emptyObject,
  allIds: emptyArray
  // paymentIdsById: emptyObject
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
    // case BATCHPAYMENT_ADD:
    //   return {
    //     ...state,
    //     paymentIdsById: {
    //       ...state.paymentIdsById,
    //       [data.batchStudentId]: ids.add(
    //         get(state.paymentIdsById, data.batchStudentId),
    //         data
    //       )
    //     }
    //   }
    // case BATCHPAYMENT_BULK_ADD:
    //   return {
    //     ...state,
    //     paymentIdsById: {
    //       ...state.paymentIdsById,
    //       ...mapValues(
    //         groupBy(data.items, 'batchStudentId'),
    //         (items, batchStudentId) =>
    //           ids.addBulk(get(state.paymentIdsById, batchStudentId), { items })
    //       )
    //     }
    //   }
    default:
      return state
  }
}

const initialClassPaymentsState = {
  byId: emptyObject,
  allIds: emptyArray,
  idsByYear: emptyObject
}

const batchClassPaymentsReducer = (
  state = initialClassPaymentsState,
  { type, data }
) => {
  switch (type) {
    case BATCHCLASSPAYMENT_ADD:
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
    case BATCHCLASSPAYMENT_BULK_ADD:
      return {
        ...state,
        byId: {
          ...state.byId,
          ...keyBy(data.items, 'id')
        },
        allIds: ids.addBulk(state.allIds, data)
      }
    case BATCHCLASSPAYMENT_REMOVE:
      return {
        ...state,
        byId: pickBy(state.byId, ({ id }) => id !== data.id),
        allIds: ids.remove(state.allIds, data)
      }
    default:
      return state
  }
}

const initialClassPaymentRemindersState = {
  byId: emptyObject,
  allIds: emptyArray,
  idsByKey: emptyObject
}

const batchClassPaymentRemindersReducer = (
  state = initialClassPaymentRemindersState,
  { type, data, batchClassId, year, month }
) => {
  const key = `${batchClassId}:${year}:${month}`

  switch (type) {
    case BATCHCLASSPAYMENT_REMINDER_ADD:
      return {
        ...state,
        byId: {
          ...state.byId,
          [data.id]: {
            ...data
          }
        },
        allIds: ids.add(state.allIds, data),
        idsByKey: {
          ...state.idsByKey,
          [key]: ids.add(state.idsByKey[key], data)
        }
      }
    case BATCHCLASSPAYMENT_REMINDER_SET_ALL:
      return {
        ...state,
        byId: {
          ...state.byId,
          ...keyBy(data.items, 'id')
        },
        allIds: ids.addBulk(state.allIds, data),
        idsByKey: {
          ...state.idsByKey,
          [key]: ids.addBulk(state.idsByKey[key], data)
        }
      }
    default:
      return state
  }
}

const initialCoursePaymentsState = {
  byId: emptyObject,
  allIds: emptyArray,
  idsByYear: emptyObject
}

const batchCoursePaymentsReducer = (
  state = initialCoursePaymentsState,
  { type, data }
) => {
  switch (type) {
    case BATCHCOURSEPAYMENT_ADD:
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
    case BATCHCOURSEPAYMENT_BULK_ADD:
      return {
        ...state,
        byId: {
          ...state.byId,
          ...keyBy(data.items, 'id')
        },
        allIds: ids.addBulk(state.allIds, data)
      }
    case BATCHCOURSEPAYMENT_REMOVE:
      return {
        ...state,
        byId: pickBy(state.byId, ({ id }) => id !== data.id),
        allIds: ids.remove(state.allIds, data)
      }
    default:
      return state
  }
}

const initialCoursePaymentRemindersState = {
  byId: emptyObject,
  allIds: emptyArray,
  idsByKey: emptyObject
}

const batchCoursePaymentRemindersReducer = (
  state = initialCoursePaymentRemindersState,
  { type, data, batchCourseId, year }
) => {
  const key = `${batchCourseId}:${year}`

  switch (type) {
    case BATCHCOURSEPAYMENT_REMINDER_ADD:
      return {
        ...state,
        byId: {
          ...state.byId,
          [data.id]: {
            ...data
          }
        },
        allIds: ids.add(state.allIds, data),
        idsByKey: {
          ...state.idsByKey,
          [key]: ids.add(state.idsByKey[key], data)
        }
      }
    case BATCHCOURSEPAYMENT_REMINDER_SET_ALL:
      return {
        ...state,
        byId: {
          ...state.byId,
          ...keyBy(data.items, 'id')
        },
        allIds: ids.addBulk(state.allIds, data),
        idsByKey: {
          ...state.idsByKey,
          [key]: ids.addBulk(state.idsByKey[key], data)
        }
      }
    default:
      return state
  }
}

export default combineReducers({
  classes: batchClassesReducer,
  classEnrollments: batchClassEnrollmentsReducer,
  classPayments: batchClassPaymentsReducer,
  classPaymentReminders: batchClassPaymentRemindersReducer,
  courses: batchCoursesReducer,
  courseEnrollments: batchCourseEnrollmentsReducer,
  coursePayments: batchCoursePaymentsReducer,
  coursePaymentReminders: batchCoursePaymentRemindersReducer,
  students: batchStudentsReducer
})
