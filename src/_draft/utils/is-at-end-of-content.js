import isAtEndOfBlock from './is-at-end-of-block'

export default function isAtEndOfContent(contentState, selection) {
  if (!isAtEndOfBlock(contentState, selection)) return false

  const currentBlockKey = selection.getAnchorKey()
  const lastBlockKey = contentState.getLastBlock().getKey()
  return currentBlockKey === lastBlockKey
}
