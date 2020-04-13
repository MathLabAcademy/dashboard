import React from 'react'
import ReactDOM from 'react-dom'
import 'semantic-ui-less/semantic.less'
import { store } from 'store'
import theme from 'theme'
import { initializeAnalytics } from 'utils/analytics'
import Root from './Root'
import * as serviceWorker from './serviceWorker'

ReactDOM.render(
  <Root store={store} theme={theme} />,
  document.getElementById('root')
)

initializeAnalytics()

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister()
