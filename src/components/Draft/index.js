import { Editor } from '@draft-js-modules/editor'
import { getKaTeXModule } from '@draft-js-modules/katex'
import '@draft-js-modules/katex/dist/styles.css'
import { convertFromRaw, EditorState } from 'draft-js'
import 'draft-js/dist/Draft.css'
import 'katex/dist/katex.min.css'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import Controls from './Controls'
import { Button as ImageButton, getImageModule } from './modules/image'

const getModules = () => {
  const KaTeXModule = getKaTeXModule()
  const ImageModule = getImageModule()

  const modules = [ImageModule, KaTeXModule]
  return modules
}

export function DraftViewer({ rawValue, inline }) {
  return (
    <DraftEditor
      rawState={rawValue}
      readOnly={true}
      style={{ display: inline ? 'inline-block' : 'block' }}
    />
  )
}

function getInitialEditorState(rawEditorState) {
  return rawEditorState
    ? EditorState.createWithContent(convertFromRaw(JSON.parse(rawEditorState)))
    : EditorState.createEmpty()
}

function DraftEditor({ rawState, readOnly, style, storeRef }) {
  const store = useRef(null)

  const modules = useMemo(() => getModules(), [])

  useEffect(() => {
    if (storeRef) storeRef.current = () => store.current
  }, [storeRef])

  const [editorState, setEditorState] = useState(
    getInitialEditorState(rawState)
  )

  // useEffect(() => {
  //   setEditorState(getInitialEditorState(rawState))
  // }, [rawState])

  // const onClick = useCallback(() => {
  //   store.current.getEditor().focus()
  // }, [])

  return (
    <div style={style}>
      {!readOnly && (
        <Controls store={store.current}>
          <ImageButton store={store.current} />
        </Controls>
      )}

      <div>
        <Editor
          editorState={editorState}
          onChange={setEditorState}
          readOnly={readOnly}
          modules={modules}
          store={store}
          placeholder="..."
        />
      </div>
    </div>
  )
}

export default DraftEditor
