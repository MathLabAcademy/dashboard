import { UI_SET_ERROR_BOUNDARY_MESSAGE, UI_LOCALE_UPDATE } from './actionTypes'

export const updateLocale = language => ({
  type: UI_LOCALE_UPDATE,
  locale: {
    language
  }
})

export const setErrorBoundaryMessage = message => ({
  type: UI_SET_ERROR_BOUNDARY_MESSAGE,
  data: message
})
