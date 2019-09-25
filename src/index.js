import React from 'react'
import ReactDOM from 'react-dom'
import 'semantic-ui-less/semantic.less'
import { store } from 'store/index.js'
import './index.css'
import Root from './Root.js'
import * as serviceWorker from './serviceWorker.js'

ReactDOM.render(<Root store={store} />, document.getElementById('root'))

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister()
