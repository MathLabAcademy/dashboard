import { ERROR_BOUNDARY_SET_ROOT_ERROR } from 'store/actions/actionTypes'

const initialState = {
  rootError: null
}

const errorBoundaryReducer = (state = initialState, { type, data }) => {
  switch (type) {
    case ERROR_BOUNDARY_SET_ROOT_ERROR:
      return {
        ...state,
        rootError: data
      }
    default:
      return state
  }
}

export default errorBoundaryReducer
