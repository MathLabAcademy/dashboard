export async function getFacebookPermissions() {
  return new Promise((resolve) => {
    window.FB.api('/me/permissions', {}, (response) => {
      const permissions = response.data.reduce(
        (permissions, { permission, status }) => {
          permissions[permission] = status
          return permissions
        },
        {}
      )
      resolve(permissions)
    })
  })
}

export async function initiateFacebookLogin({ scope, authType }) {
  return new Promise((resolve, reject) => {
    window.FB.login(
      (response) => {
        if (response.status !== 'connected') {
          return reject(new Error('Failed to connect with Facebook account!'))
        }

        return resolve({
          status: response.status,
          authResponse: response.authResponse,
        })
      },
      { scope, auth_type: authType }
    )
  })
}
