import { Editor } from '@draft-js-modules/editor'
import { getKaTeXModule } from '@draft-js-modules/katex'
import 'draft-js/dist/Draft.css'
import '@draft-js-modules/katex/dist/styles.css'
import { convertFromRaw, EditorState } from 'draft-js'
import 'katex/dist/katex.min.css'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { getImageModule, Button as ImageButton } from './modules/image'
import Controls from './Controls'

const KaTeXModule = getKaTeXModule()
const ImageModule = getImageModule()

const modules = [ImageModule, KaTeXModule]

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

  console.log(`${Date.now()} `, editorState)

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
