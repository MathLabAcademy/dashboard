import {
  CompositeDecorator,
  convertFromRaw,
  Editor,
  EditorState,
  getDefaultKeyBinding,
  RichUtils
} from 'draft-js'
import 'draft-js/dist/Draft.css'
import * as TeXPlugin from 'draft/plugins/tex/index.js'
import useInstance from 'hooks/useInstance.js'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Controls from './Controls.js'
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

const defaultKeyBindingFn = (event, getStore) => {
  switch (event.keyCode) {
    default:
      return getDefaultKeyBinding(event)
  }
}

const getKeyBindingFn = (getStore, pluginKeyBindingFns = []) => event => {
  const keyBindingFns = [].concat(pluginKeyBindingFns)

  const next = () => keyBindingFns.shift()

  let nextKeyBindingFn = next()

  while (typeof nextKeyBindingFn === 'function') {
    nextKeyBindingFn = nextKeyBindingFn(event, getStore, next)
  }

  if (typeof nextKeyBindingFn === 'string') return nextKeyBindingFn

  return defaultKeyBindingFn(event, getStore)
}

const defaultHandleKeyCommand = (command, editorState, getStore) => {
  const newEditorState = RichUtils.handleKeyCommand(editorState, command)

  if (newEditorState) {
    getStore().setEditorState(newEditorState)
    return 'handled'
  }

  return 'not-handled'
}

const getHandleKeyCommand = (getStore, pluginHandleKeyCommands = []) => (
  command,
  editorState
) => {
  const handleKeyCommands = [].concat(pluginHandleKeyCommands)

  const next = () => handleKeyCommands.shift()

  let nextHandleKeyCommand = next()

  while (typeof nextHandleKeyCommand === 'function') {
    nextHandleKeyCommand = nextHandleKeyCommand(
      command,
      editorState,
      getStore,
      next
    )
  }

  if (typeof nextHandleKeyCommand === 'string') return nextHandleKeyCommand

  return defaultHandleKeyCommand(command, editorState, getStore)
}

const decorators = [TeXPlugin.decorator]
const pluginKeyBindingFns = [TeXPlugin.keyBindingFn]
const pluginHandleKeyCommands = [TeXPlugin.handleKeyCommand]

export function DraftViewer({ rawValue, inline }) {
  const [editorState, setEditorState] = useState(
    rawValue
      ? EditorState.createWithContent(convertFromRaw(JSON.parse(rawValue)))
      : EditorState.createEmpty()
  )

  useEffect(() => {
    setEditorState(
      rawValue
        ? EditorState.createWithContent(convertFromRaw(JSON.parse(rawValue)))
        : EditorState.createEmpty()
    )
  }, [rawValue])

  console.log(rawValue)
  return (
    <DraftEditor
      editorState={editorState}
      setEditorState={setEditorState}
      readOnly={true}
      style={{ display: inline ? 'inline-block' : 'block' }}
    />
  )
}

function DraftEditor({
  editorState,
  setEditorState,
  readOnly: _readOnly,
  style
}) {
  const editor = useRef()

  const [__readOnly, setReadOnly] = useState(_readOnly)

  useEffect(() => {
    setReadOnly(_readOnly)
  }, [_readOnly])

  const readOnly = useMemo(() => {
    return __readOnly || _readOnly
  }, [__readOnly, _readOnly])

  const getEditorState = useCallback(() => editorState, [editorState])
  const getReadOnly = useCallback(() => readOnly, [readOnly])

  const pluginStore = useInstance({
    getEditorRef: () => editor.current,
    setEditorState,
    setReadOnly
  })
  pluginStore.getEditorState = getEditorState
  pluginStore.getReadOnly = getReadOnly

  const getStore = useCallback(() => pluginStore, [pluginStore])

  const compositeDecorator = useMemo(() => {
    return new CompositeDecorator(
      decorators.map(decorator =>
        Object.assign({ props: { getStore } }, decorator)
      )
    )
  }, [getStore])

  useEffect(() => {
    setEditorState(editorState =>
      EditorState.set(editorState, { decorator: compositeDecorator })
    )
  }, [compositeDecorator, setEditorState])

  const onChange = useCallback(
    editorState => {
      setEditorState(editorState)
    },
    [setEditorState]
  )

  const handleKeyCommand = useMemo(
    () => getHandleKeyCommand(getStore, pluginHandleKeyCommands),
    [getStore]
  )

  const keyBindingFn = useMemo(
    () => getKeyBindingFn(getStore, pluginKeyBindingFns),
    [getStore]
  )

  const blockRendererFn = useCallback(
    contentBlock => {
      const type = contentBlock.getType()
      const atomic = type === 'atomic'
      const texBlock = contentBlock.getData().get('atomic') === 'texblock'

      if (atomic && texBlock) {
        return {
          component: TeXPlugin.Block,
          editable: false,
          props: {
            getStore
          }
        }
      }
      return null
    },
    [getStore]
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
            blockRendererFn={blockRendererFn}
            handleKeyCommand={handleKeyCommand}
            keyBindingFn={keyBindingFn}
          />
        </div>
      </div>
    </>
  )
}

export default DraftEditor
