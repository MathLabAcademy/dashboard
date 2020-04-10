import md5 from 'md5-o-matic'
import { stringify } from 'query-string'

const baseUrl = 'https://www.gravatar.com/avatar'

const gravatarUrl = (
  email = 'user@example.com',
  options = { d: 'robohash' },
  noThrow = false
) => {
  options = Object.assign({ d: 'retro' }, options)

  if (!~email.indexOf('@')) {
    if (noThrow) return null

    throw new Error('invalid email')
  }

  return `${baseUrl}/${md5(email.toLowerCase().trim())}?${stringify(options)}`
}

export default gravatarUrl
