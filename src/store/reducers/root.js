import { combineReducers } from 'redux'
import { CURRENT_USER_REMOVE } from 'store/actions/actionTypes.js'
import batches from './batches.js'
import courses from './courses.js'
import courseTags from './courseTags.js'
import cqExams from './cqExams.js'
import user from './currentUser.js'
import errorBoundary from './errorBoundary.js'
import mcqExams from './mcqExams.js'
import mcqs from './mcqs.js'
import mcqTags from './mcqTags.js'
import pagination from './pagination.js'
import transactions from './transactions.js'
import ui from './ui.js'
import users from './users.js'

const rootReducer = combineReducers({
  batches,
  courses,
  courseTags,
  cqExams,
  user,
  errorBoundary,
  mcqExams,
  mcqs,
  mcqTags,
  pagination,
  transactions,
  ui,
  users
})

export default (state, action) => {
  if (action.type === CURRENT_USER_REMOVE) {
    state = { errorBoundary: state.errorBoundary }
  }

  return rootReducer(state, action)
}
