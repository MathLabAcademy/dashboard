import React from 'react'

import { Provider } from 'react-redux'

import I18nProvider from 'i18n/index.js'

import App from './App'

const Root = ({ store }) => (
  <Provider store={store}>
    <I18nProvider>
      <App />
    </I18nProvider>
  </Provider>
)

export default Root
