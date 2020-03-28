import { EditorState, SelectionState } from 'draft-js'
import TeXBlock from './TeXBlock'

const ArrowLeft = 37
const ArrowRight = 39

export function blockRendererFn(block, getStore, next) {
  const isAtomic = block.getType() === 'atomic'
  const isTexBlock = block.getData().get('atomic') === 'texblock'

  if (isAtomic && isTexBlock) {
    return {
      component: TeXBlock,
      editable: false,
      props: {
        getStore,
      },
    }
  }

  return next()
}

export function keyBindingFn(event, getStore, next) {
  const store = getStore()
  const editorState = store.getEditorState()

  if (event.keyCode === ArrowRight || event.keyCode === ArrowLeft) {
    const direction = event.keyCode === ArrowRight ? 'r' : 'l'
    const selection = editorState.getSelection()
    const contentState = editorState.getCurrentContent()

    if (!selection.isCollapsed()) return next()

    const startOffset = selection.getStartOffset()
    const blockKey = selection.getStartKey()
    const block = contentState.getBlockForKey(blockKey)

    if (block.getLength() === startOffset && direction === 'r') {
      const blockAfter = contentState.getBlockAfter(blockKey)
      if (
        blockAfter &&
        blockAfter.getType() === 'atomic' &&
        blockAfter.getData().get('atomic') === 'texblock'
      ) {
        return `update-texblock-${direction}-${blockAfter.getKey()}`
      }
    }

    if (startOffset === 0 && direction === 'l') {
      const blockBefore = contentState.getBlockBefore(blockKey)
      if (
        blockBefore &&
        blockBefore.getType() === 'atomic' &&
        blockBefore.getData().get('atomic') === 'texblock'
      ) {
        return `update-texblock-${direction}-${blockBefore.getKey()}`
      }
    }

    const entityKey = block.getEntityAt(
      startOffset - (direction === 'l' ? 1 : 0)
    )
    if (
      entityKey &&
      contentState.getEntity(entityKey).getType() === 'inlinetex'
    ) {
      return `update-inlinetex-${direction}-${entityKey}`
    }
  }

  return next()
}

function jumpSelectionOverEntity(editorState, getStore, { entityKey, dir }) {
  const store = getStore()

  const contentState = editorState.getCurrentContent()
  const selectionState = editorState.getSelection()
  const blockKey = selectionState.getStartKey()
  const block = contentState.getBlockForKey(blockKey)

  let selectionToJump

  block.findEntityRanges(
    (character) => {
      const characterEntityKey = character.getEntity()
      return characterEntityKey && characterEntityKey === entityKey
    },
    (start, end) => {
      let offset
      if (dir === 'l') offset = start
      if (dir === 'r') offset = end

      if (offset) {
        selectionToJump = SelectionState.createEmpty(blockKey).merge({
          anchorOffset: offset,
          focusOffset: offset,
        })
      }
    }
  )

  if (!selectionToJump) return

  store.setEditorState(EditorState.forceSelection(editorState, selectionToJump))
}

function jumpSelectionOverBlock(editorState, getStore, { blockKey, dir }) {
  const store = getStore()

  const contentState = editorState.getCurrentContent()

  let selectionToJump

  if (dir === 'l') {
    const blockBefore = contentState.getBlockBefore(blockKey)
    if (!blockBefore) return

    const selectionOffset = blockBefore.getLength()
    selectionToJump = SelectionState.createEmpty(blockBefore.getKey()).merge({
      anchorOffset: selectionOffset,
      focusOffset: selectionOffset,
    })
  }

  if (dir === 'r') {
    const blockAfter = contentState.getBlockAfter(blockKey)
    if (!blockAfter) return

    selectionToJump = SelectionState.createEmpty(blockAfter.getKey())
  }

  if (!selectionToJump) return

  store.setEditorState(EditorState.forceSelection(editorState, selectionToJump))
}

export function handleKeyCommand(command, editorState, getStore, next) {
  if (command.slice(0, 16) === 'update-inlinetex') {
    const dir = command.slice(17, 18)
    const entityKey = command.slice(19)
    jumpSelectionOverEntity(editorState, getStore, { entityKey, dir })
    return 'handled'
  }

  if (command.slice(0, 15) === 'update-texblock') {
    const dir = command.slice(16, 17)
    const blockKey = command.slice(18)
    jumpSelectionOverBlock(editorState, getStore, { blockKey, dir })
    return 'handled'
  }

  return next()
}

export function findInlineTeXEntities(contentBlock, callback, contentState) {
  contentBlock.findEntityRanges((character) => {
    const entityKey = character.getEntity()
    if (entityKey === null) return false
    return contentState.getEntity(entityKey).getType() === 'inlinetex'
  }, callback)
}
