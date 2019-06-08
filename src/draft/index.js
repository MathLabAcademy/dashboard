import { Editor } from 'draft-js'
import 'draft-js/dist/Draft.css'
import * as TeXPlugin from 'draft/plugins/tex/index.js'
import React, { useCallback, useEffect } from 'react'
import Controls from './Controls.js'
import useEditor from './hooks/useEditor.js'
import './index.css'

const customStyleMap = {
  CODE: {
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    fontFamily: '"Inconsolata", "Menlo", "Consolas", monospace',
    fontSize: 16,
    padding: 2
  }
}

function blockStyleFn(block) {
  switch (block.getType()) {
    case 'blockquote':
      return 'RichEditor-blockquote'
    default:
      return null
  }
}

const plugins = [TeXPlugin]

export function DraftViewer({ rawValue, inline }) {
  return (
    <DraftEditor
      rawState={rawValue}
      readOnly={true}
      style={{ display: inline ? 'inline-block' : 'block' }}
    />
  )
}

function DraftEditor({ rawState, readOnly: _readOnly, storeRef, style }) {
  const {
    editor,
    editorState,
    setEditorState,
    readOnly,
    editorProps,
    getStore
  } = useEditor(rawState, _readOnly, plugins)

  useEffect(() => {
    if (storeRef) storeRef.current = getStore
  }, [getStore, storeRef])

  const onChange = useCallback(
    editorState => {
      setEditorState(editorState)
    },
    [setEditorState]
  )

  const contentState = editorState.getCurrentContent()

  let className = 'RichEditor-editor'
  if (!contentState.hasText()) {
    if (
      contentState
        .getBlockMap()
        .first()
        .getType() !== 'unstyled'
    ) {
      className += ' RichEditor-hidePlaceholder'
    }
  }

  if (!_readOnly) {
    className += ' RichEditor-active'
  }

  return (
    <>
      <div style={style}>
        {!_readOnly && (
          <Controls editorState={editorState} setEditorState={setEditorState}>
            <TeXPlugin.Button getStore={getStore} />
          </Controls>
        )}

        <div className={className}>
          <Editor
            ref={editor}
            readOnly={readOnly}
            editorState={editorState}
            onChange={onChange}
            placeholder="..."
            spellCheck={true}
            blockStyleFn={blockStyleFn}
            customStyleMap={customStyleMap}
            {...editorProps}
          />
        </div>
      </div>
    </>
  )
}

export default DraftEditor
