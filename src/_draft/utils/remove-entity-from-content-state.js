import { Modifier, SelectionState } from 'draft-js'

export default function removeEntityFromContentState(
  contentState,
  blockKey,
  start,
  end
) {
  const selectionToRemove = SelectionState.createEmpty(blockKey).merge({
    anchorOffset: start,
    focusOffset: end,
  })

  return Modifier.removeRange(contentState, selectionToRemove, 'backward')
}
