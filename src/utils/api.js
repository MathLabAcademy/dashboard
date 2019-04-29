import { dispatchToStore } from 'store/index.js'
import { setErrorBoundaryMessage } from 'store/actions/ui.js'

async function api(endpoint, options = {}) {
  const Response = {
    meta: {}
  }

  const url = `/api${endpoint}`

  options = Object.assign({ credentials: 'include', method: 'GET' }, options)
  options.method = options.method.toUpperCase()
  options.headers = Object.assign(
    {
      'content-type': 'application/json'
    },
    options.headers
  )

  if (!['string', 'undefined'].includes(typeof options.body)) {
    options.body = JSON.stringify(options.body)
  }

  const res = await fetch(url, options)

  Response.meta.status = res.status

  if (res.status >= 500) {
    dispatchToStore(
      setErrorBoundaryMessage(`Error ${res.status}: ${res.statusText}`)
    )
    return Response
  }

  if (res.status === 204) {
    Response.data = null
    return Response
  }

  const contentType = res.headers.get('content-type')

  if (!/application\/json/.test(contentType)) {
    throw new Error(`Unsupported Content-Type: ${contentType}`)
  }

  const { data, error, ...meta } = await res.json()

  Response.meta = Object.assign(Response.meta, meta)
  Response.data = data
  Response.error = error

  return Response
}

export default api
