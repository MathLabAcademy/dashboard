import { union } from 'lodash-es'
import { emptyArray } from 'utils/defaults'

export const add = (state = emptyArray, { id }) => union(state, [id])

export const addBulk = (state = emptyArray, { items }) =>
  union(
    state,
    items.map(({ id }) => id)
  )

export const remove = (state = emptyArray, { id }) =>
  state.filter(i => i !== id)
