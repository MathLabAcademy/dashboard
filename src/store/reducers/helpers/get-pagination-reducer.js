import { map } from 'lodash-es'
import { emptyArray, emptyObject } from 'utils/defaults.js'

const initialPaginationState = {
  fetching: false,
  pages: emptyObject,
  hasPages: 0,
  totalPages: 0,
  totalItems: 0,
  itemsPerPage: 0,
  nextLink: null
}

const getPaginationReducer = ({ ADD, REMOVE, REQUEST }) => (
  state = initialPaginationState,
  { type, data, page, query = '' }
) => {
  switch (type) {
    case ADD:
      return {
        fetching: false,
        pages: {
          ...state.pages,
          [page]: {
            fetching: false,
            itemIds: map(data.items, 'id'),
            query
          }
        },
        hasPages: state.hasPages + 1,
        totalPages: data.totalPages,
        totalItems: data.totalItems,
        itemsPerPage: data.itemsPerPage,
        nextLink: data.nextLink
      }
    case REMOVE:
      return {
        ...state,
        fetching: false,
        pages: {
          ...state.pages,
          [page]: undefined
        }
      }
    case REQUEST:
      return {
        ...state,
        fetching: true,
        pages: {
          ...state.pages,
          [page]: {
            fetching: true,
            itemIds: emptyArray,
            query
          }
        }
      }
    default:
      return state
  }
}

export default getPaginationReducer
