import { Modifier, EditorState } from 'draft-js'

function insertEntity(editorState, type, data, characters = ' ') {
  const contentState = editorState.getCurrentContent()
  const selection = editorState.getSelection()

  const contentStateWithEntity = contentState.createEntity(
    type,
    'IMMUTABLE',
    data
  )

  const entityKey = contentStateWithEntity.getLastCreatedEntityKey()

  const newConentState = Modifier.insertText(
    contentState,
    selection,
    characters,
    null,
    entityKey
  )

  return EditorState.push(editorState, newConentState, 'insert-characters')
}

export default insertEntity
