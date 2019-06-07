export default function isCurrentBlockEmpty(contentState, selection) {
  const currentBlockKey = selection.getAnchorKey()
  const currentBlock = contentState.getBlockForKey(currentBlockKey)
  return currentBlock.getText().length === 0
}
