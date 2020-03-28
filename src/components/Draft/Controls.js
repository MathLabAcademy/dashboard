import { RichUtils } from 'draft-js'
import React, { useCallback } from 'react'
import { Button } from 'semantic-ui-react'

function StyleButton({ style, onToggle, active, label, icon }) {
  const _onToggle = useCallback(
    (e) => {
      e.preventDefault()
      onToggle(style)
    },
    [onToggle, style]
  )

  return (
    <Button
      type="button"
      active={active}
      onClick={_onToggle}
      icon={icon}
      content={label}
    />
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
  { style: 'unordered-list-item', icon: 'list ul' },
  { style: 'ordered-list-item', icon: 'list ol' },
  // { label: 'Code Block', style: 'code-block' }
]

function BlockStyleControls({ editorState, onToggle }) {
  const selection = editorState.getSelection()
  const blockType = editorState
    .getCurrentContent()
    .getBlockForKey(selection.getStartKey())
    .getType()

  return BLOCK_TYPES.map((type) => (
    <StyleButton
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
  { style: 'BOLD', icon: 'bold' },
  { style: 'ITALIC', icon: 'italic' },
  { style: 'UNDERLINE', icon: 'underline' },
  // { style: 'CODE', icon: 'code' }
]

function InlineStyleControls({ editorState, onToggle }) {
  const currentStyle = editorState.getCurrentInlineStyle()

  return INLINE_STYLES.map((type) => (
    <StyleButton
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
      <BlockStyleControls
        editorState={editorState}
        onToggle={toggleBlockType}
      />

      <InlineStyleControls
        editorState={editorState}
        onToggle={toggleInlineStyle}
      />

      {children}
    </div>
  )
}

export default RichEditorControls
