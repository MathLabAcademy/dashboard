import { Editor } from '@draft-js-modules/editor'
import { getKaTeXModule } from '@draft-js-modules/katex'
import '@draft-js-modules/katex/dist/styles.css'
import { convertFromRaw, EditorState } from 'draft-js'
import 'draft-js/dist/Draft.css'
import 'katex/dist/katex.min.css'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import Controls from './Controls'
import { Button as ImageButton, getImageModule } from './modules/image'

const getModules = disableImage => {
  const KaTeXModule = getKaTeXModule()
  const ImageModule = disableImage ? null : getImageModule()

  const modules = [ImageModule, KaTeXModule].filter(Boolean)
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

function getInitialEditorState(rawEditorState, currentEditorState) {
  const decorator = currentEditorState
    ? currentEditorState.getDecorator()
    : undefined

  return rawEditorState
    ? EditorState.createWithContent(
        convertFromRaw(JSON.parse(rawEditorState)),
        decorator
      )
    : EditorState.createEmpty(decorator)
}

function DraftEditor({ rawState, readOnly, style, storeRef, disableImage }) {
  const store = useRef(null)

  const modules = useMemo(() => getModules(disableImage), [disableImage])

  useEffect(() => {
    if (storeRef) storeRef.current = () => store.current
  }, [storeRef])

  const [editorState, setEditorState] = useState(
    getInitialEditorState(rawState)
  )

  useEffect(() => {
    setEditorState(editorState => getInitialEditorState(rawState, editorState))
  }, [rawState, readOnly])

  // const onClick = useCallback(() => {
  //   store.current.getEditor().focus()
  // }, [])

  return (
    <div style={style}>
      {!readOnly && (
        <Controls store={store.current}>
          {!disableImage && <ImageButton store={store.current} />}
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
