import { convertFromRaw, EditorState } from 'draft-js'
import useDecorator from 'draft/hooks/useDecorator'
import useProps from 'draft/hooks/useProps'
import useInstance from 'hooks/useInstance'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

function useEditor(rawState, _readOnly, plugins) {
  const editor = useRef()

  const [editorState, setEditorState] = useState(EditorState.createEmpty())

  const [__readOnly, setReadOnly] = useState(_readOnly)

  useEffect(() => {
    setReadOnly(_readOnly)
  }, [_readOnly])

  const readOnly = useMemo(() => {
    return __readOnly || _readOnly
  }, [__readOnly, _readOnly])

  const getEditorState = useCallback(() => editorState, [editorState])
  const getReadOnly = useCallback(() => readOnly, [readOnly])

  const store = useInstance({
    getEditorRef: () => editor.current,
    setEditorState,
    setReadOnly
  })
  store.getEditorState = getEditorState
  store.getReadOnly = getReadOnly

  const getStore = useCallback(() => store, [store])

  const editorProps = useProps(getStore, plugins)
  const decorator = useDecorator(getStore, plugins)

  useEffect(() => {
    const newEditorState = rawState
      ? EditorState.createWithContent(
          convertFromRaw(JSON.parse(rawState)),
          decorator
        )
      : EditorState.createEmpty(decorator)

    setEditorState(newEditorState)
  }, [decorator, rawState, setEditorState])

  return {
    editor,
    editorState,
    setEditorState,
    readOnly,
    editorProps,
    getStore
  }
}

export default useEditor
