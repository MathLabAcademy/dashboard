import { SelectionState } from 'draft-js'

export default function getNewBlockSelection(blockBefore, blockAfter, after) {
  if (!blockAfter && !blockBefore) return undefined

  let nextBlock
  let offset

  if (after) {
    nextBlock = blockAfter || blockBefore
    offset = blockAfter ? 0 : nextBlock.getLength()
  } else {
    nextBlock = blockBefore || blockAfter
    offset = blockBefore ? nextBlock.getLength() : 0
  }

  return SelectionState.createEmpty(nextBlock.getKey()).merge({
    anchorOffset: offset,
    focusOffset: offset,
    hasFocus: true,
  })
}
