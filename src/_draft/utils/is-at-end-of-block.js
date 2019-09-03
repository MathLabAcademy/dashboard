export default function isAtEndOfBlock(contentState, selection) {
  const currentBlockKey = selection.getAnchorKey()
  const currentBlock = contentState.getBlockForKey(currentBlockKey)
  return currentBlock.getText().length === selection.getStartOffset()
}
