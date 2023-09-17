import { useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import ReactGA from 'react-ga'

const isProduction = process.env.NODE_ENV === 'production'

let analyticsIntialized = false

export function initializeAnalytics() {
  if (analyticsIntialized) {
    throw new Error('Analytics already initialized!')
  }

  if (!isProduction) {
    window.ga = (...params) => {
      console.debug('Analytics:', ...params)
    }
  }

  ReactGA.initialize(`UA-163468977-1`, {
    gaOptions: {},
    standardImplementation: !isProduction,
  })

  analyticsIntialized = true
}

let previousPage = null
export function usePageviewAnalytics() {
  const page = useLocation().pathname

  useEffect(() => {
    if (previousPage !== page) {
      previousPage = page
      ReactGA.set({ page })
      ReactGA.pageview(page)
    }
  }, [page])
}

export function trackEventAnalytics({
  category,
  action,
  label,
  value,
  nonInteraction,
  transport,
}) {
  ReactGA.event({ category, action, label, value, nonInteraction, transport })
}
