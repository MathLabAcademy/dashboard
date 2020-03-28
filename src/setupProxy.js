const { createProxyMiddleware } = require('http-proxy-middleware')

const apiUrl = process.env.REACT_APP_API_URL

module.exports = (app) => {
  app.use(
    '/api/downloads/**',
    createProxyMiddleware({
      target: 'http://localhost',
      pathRewrite: (path) => path.replace(/^\/api/, ''),
    })
  )
  app.use(
    '/api/**',
    createProxyMiddleware({
      target: apiUrl,
      pathRewrite: (path) => path.replace(/^\/api/, ''),
    })
  )
}
