import React from 'react'

const getType = (chars) => {
  switch (chars) {
    case '*':
    case '-':
    case '+':
      return 'list-item'
    case '>':
      return 'block-quote'
    case '#':
      return 'heading-one'
    case '##':
      return 'heading-two'
    case '###':
      return 'heading-three'
    case '####':
      return 'heading-four'
    case '#####':
      return 'heading-five'
    case '######':
      return 'heading-six'
    default:
      return null
  }
}

function onBackspace(event, editor, next) {
  const { value } = editor
  const { selection } = value
  if (selection.isExpanded) return next()
  if (selection.start.offset !== 0) return next()

  const { startBlock } = value
  if (startBlock.type === 'paragraph') return next()

  event.preventDefault()
  editor.setBlocks('paragraph')

  if (startBlock.type === 'list-item') {
    editor.unwrapBlock('bulleted-list')
  }
}

function onSpace(event, editor, next) {
  const { value } = editor
  const { selection } = value
  if (selection.isExpanded) return next()

  const { startBlock } = value
  const { start } = selection
  const chars = startBlock.text.slice(0, start.offset).replace(/\s*/g, '')
  const type = getType(chars)
  if (!type) return next()
  if (type === 'list-item' && startBlock.type === 'list-item') return next()
  event.preventDefault()

  editor.setBlocks(type)

  if (type === 'list-item') {
    editor.wrapBlock('bulleted-list')
  }

  editor.moveFocusToStartOfNode(startBlock).delete()
}

function onEnter(event, editor, next) {
  const { value } = editor
  const { selection } = value
  const { start, end, isExpanded } = selection
  if (isExpanded) return next()

  const { startBlock } = value
  if (start.offset === 0 && startBlock.text.length === 0)
    return onBackspace(event, editor, next)
  if (end.offset !== startBlock.text.length) return next()

  if (
    startBlock.type !== 'heading-one' &&
    startBlock.type !== 'heading-two' &&
    startBlock.type !== 'heading-three' &&
    startBlock.type !== 'heading-four' &&
    startBlock.type !== 'heading-five' &&
    startBlock.type !== 'heading-six' &&
    startBlock.type !== 'block-quote'
  ) {
    return next()
  }

  event.preventDefault()
  editor.splitBlock().setBlocks('paragraph')
}

function MarkdownPlugin(options = {}) {
  function onKeyDown(event, editor, next) {
    switch (event.key) {
      case ' ':
        return onSpace(event, editor, next)
      case 'Backspace':
        return onBackspace(event, editor, next)
      case 'Enter':
        return onEnter(event, editor, next)
      default:
        return next()
    }
  }

  function renderBlock(props, editor, next) {
    const { attributes, children, node } = props

    switch (node.type) {
      case 'block-quote':
        return <blockquote {...attributes}>{children}</blockquote>
      case 'bulleted-list':
        return <ul {...attributes}>{children}</ul>
      case 'heading-one':
        return <h1 {...attributes}>{children}</h1>
      case 'heading-two':
        return <h2 {...attributes}>{children}</h2>
      case 'heading-three':
        return <h3 {...attributes}>{children}</h3>
      case 'heading-four':
        return <h4 {...attributes}>{children}</h4>
      case 'heading-five':
        return <h5 {...attributes}>{children}</h5>
      case 'heading-six':
        return <h6 {...attributes}>{children}</h6>
      case 'list-item':
        return <li {...attributes}>{children}</li>
      case 'numbered-list':
        return <ol {...attributes}>{children}</ol>
      default:
        return next()
    }
  }

  return {
    onKeyDown,
    renderBlock,
  }
}

export default MarkdownPlugin
