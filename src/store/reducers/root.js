import { combineReducers } from 'redux'

import { CURRENT_USER_UNSET } from 'store/actions/actionTypes.js'

import ui from './ui.js'
import user from './currentUser.js'

const rootReducer = combineReducers({
  ui,
  user
})

export default (state, action) => {
  if (action.type === CURRENT_USER_UNSET) {
    state = {
      ui: state.ui
    }
  }

  return rootReducer(state, action)
}
