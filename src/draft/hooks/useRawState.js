import { convertFromRaw, EditorState } from 'draft-js'
import { useEffect } from 'react'

function useRawState(rawState, decorator, setEditorState) {
  useEffect(() => {
    const newEditorState = rawState
      ? EditorState.createWithContent(
          convertFromRaw(JSON.parse(rawState)),
          decorator
        )
      : EditorState.createEmpty(decorator)

    setEditorState(newEditorState)
  }, [decorator, rawState, setEditorState])
}

export default useRawState
