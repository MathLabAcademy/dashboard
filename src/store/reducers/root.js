import { combineReducers } from 'redux'
import { CURRENT_USER_REMOVE } from 'store/actions/actionTypes'
import batches from './batches'
import courses from './courses'
import courseTags from './courseTags'
import cqExams from './cqExams'
import user from './currentUser'
import enrollments from '../enrollments/reducer'
import errorBoundary from './errorBoundary'
import mcqExams from './mcqExams'
import mcqs from './mcqs'
import mcqTags from './mcqTags'
import pagination from './pagination'
import transactions from './transactions'
import ui from './ui'
import users from './users'

const rootReducer = combineReducers({
  batches,
  courses,
  courseTags,
  cqExams,
  user,
  enrollments,
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
