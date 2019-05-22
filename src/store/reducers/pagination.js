import { combineReducers } from 'redux'
import {
  COURSE_PAGE_ADD,
  COURSE_PAGE_REMOVE,
  COURSE_PAGE_REQUEST,
  COURSE_PAGINATION_PURGE,
  MCQ_PAGE_ADD,
  MCQ_PAGE_REMOVE,
  MCQ_PAGE_REQUEST,
  MCQ_PAGINATION_PURGE,
  MCQTAG_PAGE_ADD,
  MCQTAG_PAGE_REMOVE,
  MCQTAG_PAGE_REQUEST,
  MCQTAG_PAGINATION_PURGE,
  USER_PAGE_ADD,
  USER_PAGE_REMOVE,
  USER_PAGE_REQUEST,
  USER_PAGINATION_PURGE
} from 'store/actions/actionTypes.js'
import getPaginationReducer from './helpers/get-pagination-reducer.js'

const courses = getPaginationReducer({
  ADD: COURSE_PAGE_ADD,
  REMOVE: COURSE_PAGE_REMOVE,
  REQUEST: COURSE_PAGE_REQUEST,
  PURGE: COURSE_PAGINATION_PURGE
})

const mcqs = getPaginationReducer({
  ADD: MCQ_PAGE_ADD,
  REMOVE: MCQ_PAGE_REMOVE,
  REQUEST: MCQ_PAGE_REQUEST,
  PURGE: MCQ_PAGINATION_PURGE
})

const mcqTags = getPaginationReducer({
  ADD: MCQTAG_PAGE_ADD,
  REMOVE: MCQTAG_PAGE_REMOVE,
  REQUEST: MCQTAG_PAGE_REQUEST,
  PURGE: MCQTAG_PAGINATION_PURGE
})

const users = getPaginationReducer({
  ADD: USER_PAGE_ADD,
  REMOVE: USER_PAGE_REMOVE,
  REQUEST: USER_PAGE_REQUEST,
  PURGE: USER_PAGINATION_PURGE
})

const paginationReducer = combineReducers({
  courses,
  mcqs,
  mcqTags,
  users
})

export default paginationReducer
