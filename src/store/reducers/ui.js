import { UI_LOCALE_UPDATE } from 'store/actions/actionTypes.js'

const initialState = {
  locale: {
    language: 'en'
  }
}

const uiReducer = (state = initialState, { type, locale }) => {
  switch (type) {
    case UI_LOCALE_UPDATE:
      return {
        ...state,
        locale: {
          ...state.locale,
          ...locale
        }
      }
    default:
      return state
  }
}

export default uiReducer
