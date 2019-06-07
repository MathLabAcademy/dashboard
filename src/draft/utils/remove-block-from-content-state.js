import { ContentState } from 'draft-js'
import getNewBlockSelection from './get-new-block-selection.js'

export default function removeBlockFromContentState(
  contentState,
  block,
  after = 1
) {
  const blockMap = contentState.getBlockMap()
  const blockKey = block.getKey()
  const blockAfter = contentState.getBlockAfter(blockKey)
  const blockBefore = contentState.getBlockBefore(blockKey)

  if (!blockAfter && !blockBefore) {
    if (block.getType() === 'atomic') {
      return ContentState.createFromText('')
    }

    return contentState
  }

  const newBlockMap = blockMap.delete(blockKey)
  return contentState
    .set('blockMap', newBlockMap)
    .set('selectionAfter', getNewBlockSelection(blockBefore, blockAfter, after))
}
