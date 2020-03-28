import { UI_LOCALE_UPDATE } from 'store/actions/actionTypes'

import i18nConfig from 'i18n/config'

const initialState = {
  locale: {
    language: i18nConfig.defaultLanguage,
  },
}

const uiReducer = (state = initialState, { type, locale }) => {
  switch (type) {
    case UI_LOCALE_UPDATE:
      return {
        ...state,
        locale: {
          ...state.locale,
          ...locale,
        },
      }
    default:
      return state
  }
}

export default uiReducer
