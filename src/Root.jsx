import { CSSReset, ThemeProvider } from '@chakra-ui/core'
import { Global } from '@emotion/core'
import RootErrorBoundary from 'components/RootErrorBoundary'
import I18nProvider from 'i18n/index'
import React from 'react'
import { Provider } from 'react-redux'
import App from './App'

const Root = ({ store, theme }) => (
  <Provider store={store}>
    <RootErrorBoundary>
      <I18nProvider>
        <ThemeProvider theme={theme}>
          <CSSReset />
          <Global
            styles={{
              body: {
                fontSize: 14,
                overflow: 'hidden',
              },
              '#root': {
                height: '100vh',
                overflow: 'hidden',
              },
            }}
          />

          <App />
        </ThemeProvider>
      </I18nProvider>
    </RootErrorBoundary>
  </Provider>
)

export default Root
