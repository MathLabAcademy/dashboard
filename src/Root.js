import React from 'react'

import { Provider } from 'react-redux'

import I18nProvider from 'i18n/index.js'

import ErrorBoundary from 'components/ErrorBoundary.js'

import App from './App'

const Root = ({ store }) => (
  <Provider store={store}>
    <ErrorBoundary>
      <I18nProvider>
        <App />
      </I18nProvider>
    </ErrorBoundary>
  </Provider>
)

export default Root
