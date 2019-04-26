import {
  CURRENT_USER_LOGIN_REQUEST,
  CURRENT_USER_SET,
  CURRENT_USER_UNSET
} from 'store/actions/actionTypes.js'

const initialState = {
  data: null,
  status: {
    authed: false,
    loading: true
  }
}

const currentUserReducer = (state = initialState, { type, data }) => {
  switch (type) {
    case CURRENT_USER_LOGIN_REQUEST:
      return {
        data: null,
        status: {
          authed: false,
          loading: true
        }
      }
    case CURRENT_USER_SET:
      return {
        data,
        status: {
          authed: true,
          loading: false
        }
      }
    case CURRENT_USER_UNSET:
      return {
        data: null,
        status: {
          authed: false,
          loading: false
        }
      }
    default:
      return state
  }
}

export default currentUserReducer
