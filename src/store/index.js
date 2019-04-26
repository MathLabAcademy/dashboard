import throttle from 'lodash/throttle'

import { createStore, applyMiddleware, compose } from 'redux'

import ReduxThunkMiddleware from 'redux-thunk'

import { loadState, saveState } from 'utils/localStorage.js'

import rootReducer from 'store/reducers/root.js'

const stateLocalStorageKey = 'mathlab-state'

const preloadedState = loadState(stateLocalStorageKey)

const composeEnhancers =
  process.env.NODE_ENV === 'development'
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
    : compose

const middlewares = [ReduxThunkMiddleware]

export const store = createStore(
  rootReducer,
  preloadedState,
  composeEnhancers(applyMiddleware(...middlewares))
)

export const dispatchToStore = store.dispatch

store.subscribe(
  throttle(() => {
    const { user, ...state } = store.getState()

    saveState(stateLocalStorageKey, state)
  }, 1500)
)
