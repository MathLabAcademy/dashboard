import { UI_LOCALE_UPDATE } from 'store/actions/actionTypes.js'

import i18nConfig from 'i18n/config.js'

const initialState = {
  locale: {
    language: i18nConfig.defaultLanguage
  }
}

const uiReducer = (state = initialState, { type, data, locale }) => {
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
