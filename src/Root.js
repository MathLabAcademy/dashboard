import React from 'react'

import { Provider } from 'react-redux'

import I18nProvider from 'i18n/index.js'

import RootErrorBoundary from 'components/RootErrorBoundary.js'

import App from './App'

const Root = ({ store }) => (
  <Provider store={store}>
    <RootErrorBoundary>
      <I18nProvider>
        <App />
      </I18nProvider>
    </RootErrorBoundary>
  </Provider>
)

export default Root
