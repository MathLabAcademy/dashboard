import React from 'react'

import { Image } from 'semantic-ui-react'

import gravatarUrl from '../utils/gravatar-url'

function Gravatar({ email, params, ...props }) {
  return <Image src={gravatarUrl(email, params)} {...props} />
}

export default Gravatar
