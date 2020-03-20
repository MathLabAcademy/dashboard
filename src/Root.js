import RootErrorBoundary from 'components/RootErrorBoundary'
import { ThemeProvider } from 'emotion-theming'
import I18nProvider from 'i18n/index'
import React from 'react'
import { Provider } from 'react-redux'
import App from './App'
import theme from './theme'

const Root = ({ store }) => (
  <Provider store={store}>
    <RootErrorBoundary>
      <I18nProvider>
        <ThemeProvider theme={theme}>
          <App />
        </ThemeProvider>
      </I18nProvider>
    </RootErrorBoundary>
  </Provider>
)

export default Root
