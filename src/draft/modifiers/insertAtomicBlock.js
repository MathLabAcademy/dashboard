import {
  BlockMapBuilder,
  CharacterMetadata,
  ContentBlock,
  EditorState,
  Modifier
} from 'draft-js'
import generateRandomKey from 'draft-js/lib/generateRandomKey.js'
import { List, Repeat } from 'immutable'

function insertAtomicBlock(editorState, data, character = ' ') {
  const contentState = editorState.getCurrentContent()
  const selectionState = editorState.getSelection()

  const afterRemoval = Modifier.removeRange(
    contentState,
    selectionState,
    'backward'
  )

  const targetSelection = afterRemoval.getSelectionAfter()
  const afterSplit = Modifier.splitBlock(afterRemoval, targetSelection)
  const insertionTarget = afterSplit.getSelectionAfter()

  const asAtomicBlock = Modifier.setBlockType(
    afterSplit,
    insertionTarget,
    'atomic'
  ).createEntity(data.atomic, 'IMMUTABLE')

  const entityKey = asAtomicBlock.getLastCreatedEntityKey()

  const charData = CharacterMetadata.create({ entity: entityKey })

  const atomicBlockConfig = {
    key: generateRandomKey(),
    text: character,
    type: 'atomic',
    characterList: List(Repeat(charData, character.length)),
    data
  }

  const atomicDividerBlockConfig = {
    key: generateRandomKey(),
    type: 'unstyled'
  }

  const fragmentArray = [
    new ContentBlock(atomicBlockConfig),
    new ContentBlock(atomicDividerBlockConfig)
  ]

  const fragment = BlockMapBuilder.createFromArray(fragmentArray)

  const withAtomicBlock = Modifier.replaceWithFragment(
    asAtomicBlock,
    insertionTarget,
    fragment
  )

  const newContent = withAtomicBlock.merge({
    selectionBefore: selectionState,
    selectionAfter: withAtomicBlock.getSelectionAfter().set('hasFocus', true)
  })

  return EditorState.push(editorState, newContent, 'insert-fragment')
}

export default insertAtomicBlock
