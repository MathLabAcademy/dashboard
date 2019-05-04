import { combineReducers } from 'redux'
import {
  COURSE_PAGE_ADD,
  COURSE_PAGE_REMOVE,
  COURSE_PAGE_REQUEST,
  COURSE_PAGINATION_PURGE,
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

const users = getPaginationReducer({
  ADD: USER_PAGE_ADD,
  REMOVE: USER_PAGE_REMOVE,
  REQUEST: USER_PAGE_REQUEST,
  PURGE: USER_PAGINATION_PURGE
})

const paginationReducer = combineReducers({
  courses,
  users
})

export default paginationReducer
