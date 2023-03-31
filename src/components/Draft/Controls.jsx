import { Box, Button, Stack } from '@chakra-ui/core'
import { RichUtils } from 'draft-js'
import React, { useCallback } from 'react'
import {
  MdFormatBold,
  MdFormatItalic,
  MdFormatListBulleted,
  MdFormatListNumbered,
  MdFormatUnderlined,
} from 'react-icons/md'

function StyleButton({ style, onToggle, active, label, icon, ...props }) {
  const _onToggle = useCallback(
    (e) => {
      e.preventDefault()
      onToggle(style)
    },
    [onToggle, style]
  )

  return (
    <Button
      {...props}
      type="button"
      active={active}
      onClick={_onToggle}
      icon={icon}
    >
      {icon ? <Box as={icon} /> : label}
    </Button>
  )
}

const BLOCK_TYPES = [
  { label: 'H1', style: 'header-one' },
  { label: 'H2', style: 'header-two' },
  { label: 'H3', style: 'header-three' },
  // { label: 'H4', style: 'header-four' },
  // { label: 'H5', style: 'header-five' },
  // { label: 'H6', style: 'header-six' },
  // { style: 'blockquote', icon: 'quote left' },
  { style: 'unordered-list-item', icon: MdFormatListBulleted },
  { style: 'ordered-list-item', icon: MdFormatListNumbered },
  // { label: 'Code Block', style: 'code-block' }
]

function BlockStyleControls({ editorState, onToggle, ...props }) {
  const selection = editorState.getSelection()
  const blockType = editorState
    .getCurrentContent()
    .getBlockForKey(selection.getStartKey())
    .getType()

  return BLOCK_TYPES.map((type) => (
    <StyleButton
      {...props}
      key={type.label || type.icon}
      active={type.style === blockType}
      label={type.label}
      onToggle={onToggle}
      style={type.style}
      icon={type.icon}
    />
  ))
}

const INLINE_STYLES = [
  { style: 'BOLD', icon: MdFormatBold },
  { style: 'ITALIC', icon: MdFormatItalic },
  { style: 'UNDERLINE', icon: MdFormatUnderlined },
  // { style: 'CODE', icon: 'code' }
]

function InlineStyleControls({ editorState, onToggle, ...props }) {
  const currentStyle = editorState.getCurrentInlineStyle()

  return INLINE_STYLES.map((type) => (
    <StyleButton
      {...props}
      key={type.label || type.icon}
      active={currentStyle.has(type.style)}
      label={type.label}
      onToggle={onToggle}
      style={type.style}
      icon={type.icon}
    />
  ))
}

function RichEditorControls({ store, children }) {
  const toggleBlockType = useCallback(
    (blockType) => {
      store.setEditorState(
        RichUtils.toggleBlockType(store.getEditorState(), blockType)
      )
    },
    [store]
  )

  const toggleInlineStyle = useCallback(
    (inlineStyle) => {
      store.setEditorState(
        RichUtils.toggleInlineStyle(store.getEditorState(), inlineStyle)
      )
    },
    [store]
  )

  const editorState = store.getEditorState()

  return (
    <div
      style={{
        borderBottom: '1px solid #ddd',
        paddingBottom: '10px',
        marginBottom: '10px',
      }}
    >
      <Stack isInline spacing={2}>
        <BlockStyleControls
          editorState={editorState}
          onToggle={toggleBlockType}
        />

        <InlineStyleControls
          editorState={editorState}
          onToggle={toggleInlineStyle}
        />

        {children}
      </Stack>
    </div>
  )
}

export default RichEditorControls
