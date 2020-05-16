import { combineReducers } from 'redux'
import { CURRENT_USER_REMOVE } from 'store/currentUser'
import comments from '../comments/reducer'
import courses from '../courses/reducer'
import user from '../currentUser/reducer'
import enrollments from '../enrollments/reducer'
import notifications from '../notifications/reducer'
import videos from '../videos/reducer'
import batches from './batches'
import courseTags from './courseTags'
import cqExams from './cqExams'
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
  comments,
  courses,
  courseTags,
  cqExams,
  user,
  enrollments,
  errorBoundary,
  mcqExams,
  mcqs,
  mcqTags,
  notifications,
  pagination,
  transactions,
  ui,
  users,
  videos,
})

export default (state, action) => {
  if (action.type === CURRENT_USER_REMOVE) {
    state = { errorBoundary: state.errorBoundary }
  }

  return rootReducer(state, action)
}
