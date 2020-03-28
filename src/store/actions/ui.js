import { UI_LOCALE_UPDATE } from './actionTypes'

export const updateLocale = (language) => ({
  type: UI_LOCALE_UPDATE,
  locale: {
    language,
  },
})
