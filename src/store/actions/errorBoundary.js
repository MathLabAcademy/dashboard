import { ERROR_BOUNDARY_SET_ROOT_ERROR } from './actionTypes.js'

export const setErrorBoundaryRootError = error => ({
  type: ERROR_BOUNDARY_SET_ROOT_ERROR,
  data: error
})
