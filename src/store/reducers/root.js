import { combineReducers } from 'redux'
import { CURRENT_USER_REMOVE } from 'store/actions/actionTypes.js'
import courses from './courses.js'
import user from './currentUser.js'
import errorBoundary from './errorBoundary.js'
import pagination from './pagination.js'
import ui from './ui.js'
import users from './users.js'

const rootReducer = combineReducers({
  courses,
  user,
  errorBoundary,
  pagination,
  ui,
  users
})

export default (state, action) => {
  if (action.type === CURRENT_USER_REMOVE) {
    state = { errorBoundary: state.errorBoundary }
  }

  return rootReducer(state, action)
}
