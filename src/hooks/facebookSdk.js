import loadjs from 'loadjs'
import { useEffect, useState } from 'react'

function loadFacebookJavaScriptSDK() {
  if (!loadjs.isDefined('facebook-jssdk')) {
    loadjs(['https://connect.facebook.net/en_US/sdk.js'], 'facebook-jssdk', {
      before: (_path, scriptEl) => {
        scriptEl.defer = true
      },
      success: () => {
        console.log('Facebook JavaScript SDK successfully loaded!')
      },
      error: (depsNotFound) => {
        console.error('Facebook JavaScript SDK failed to load!', depsNotFound)
      },
    })
  }
}

export function useFacebookSdk({ paused } = {}) {
  const [initialized, setInitialized] = useState(false)

  useEffect(() => {
    if (typeof window.fbAsyncInit === 'undefined') {
      window.fbAsyncInit = () => {
        window.FB.init({
          appId: process.env.REACT_APP_FACEBOOK_APP_ID,
          autoLogAppEvents: true,
          version: 'v6.0',
          xfbml: false,
        })
      }
    }

    if (!paused) {
      loadFacebookJavaScriptSDK()
      setInitialized(true)
    }
  }, [paused])

  return {
    initialized,
  }
}
