import md5 from 'md5-o-matic'
import { stringify } from 'query-string'

const baseUrl = 'https://www.gravatar.com/avatar'

const defaultOptions = { noThrow: true, d: 'robohash' }

const gravatarUrl = (
  email,
  { noThrow = true, ...gravatarParams } = defaultOptions
) => {
  if (!email || !~email.indexOf('@')) {
    if (noThrow) return null

    throw new Error('invalid email')
  }

  const params = Object.assign({ d: defaultOptions.d }, gravatarParams)

  return `${baseUrl}/${md5(email.toLowerCase().trim())}?${stringify(params)}`
}

export default gravatarUrl
