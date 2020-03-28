import { EditorState, Modifier, SelectionState } from 'draft-js'

function removeEntity(editorState, { contentState, entityKey }) {
  const selectionState = editorState.getSelection()
  const blockKey = selectionState.getStartKey()
  const block = contentState.getBlockForKey(blockKey)

  let selectionToRemove = SelectionState.createEmpty(blockKey)

  block.findEntityRanges(
    (character) => {
      const characterEntityKey = character.getEntity()
      return characterEntityKey && characterEntityKey === entityKey
    },
    (start, end) => {
      selectionToRemove = selectionToRemove.merge({
        anchorOffset: start,
        focusOffset: end,
      })
    }
  )

  const withoutEntity = Modifier.removeRange(
    contentState,
    selectionToRemove,
    'backward'
  )

  return EditorState.push(editorState, withoutEntity, 'remove-range')
}

export default removeEntity
