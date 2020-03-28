import { EditorState, Modifier, SelectionState } from 'draft-js'

function removeBlock(editorState, blockKey) {
  const contentState = editorState.getCurrentContent()
  const contentBlock = contentState.getBlockForKey(blockKey)

  const selectionToRemove = new SelectionState({
    anchorKey: blockKey,
    anchorOffset: 0,
    focusKey: blockKey,
    focusOffset: contentBlock.getLength(),
  })

  const withoutBlock = Modifier.removeRange(
    contentState,
    selectionToRemove,
    'backward'
  )

  const resetBlock = Modifier.setBlockType(
    withoutBlock,
    withoutBlock.getSelectionAfter(),
    'unstyled'
  )

  const newEditorState = EditorState.push(
    editorState,
    resetBlock,
    'remove-range'
  )

  return EditorState.forceSelection(
    newEditorState,
    resetBlock.getSelectionAfter()
  )
}

export default removeBlock
