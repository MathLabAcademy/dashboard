import union from 'lodash/union'

export const add = (state, { id }) => union(state, [id])

export const addBulk = (state, { items }) =>
  union(state, items.map(({ id }) => id))

export const remove = (state, id) => state.filter(i => i !== id)
