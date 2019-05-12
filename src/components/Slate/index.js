import React, { useMemo, useCallback, useRef, useState } from 'react'
import { Container, Segment } from 'semantic-ui-react'
import { Value } from 'slate'
import { Editor } from 'slate-react'
import SlateEditorToolbar from './components/toolbar.js'
import defaultInitialValue from './initialValue.js'
import InlineFormatPlugin from './plugins/inline-format.js'
import KatexPlugin from './plugins/katex.js'
import MarkdownPlugin from './plugins/markdown.js'
import QueriesPlugin from './plugins/queries.js'

const plugins = [
  QueriesPlugin(),
  MarkdownPlugin(),
  KatexPlugin(),
  InlineFormatPlugin()
]

export function SlateViewer({ initialValue }) {
  const value = useMemo(
    () =>
      initialValue ? Value.fromJSON(JSON.parse(initialValue)) : Value.create(),
    [initialValue]
  )
  return <Editor value={value} plugins={plugins} readOnly />
}

function SlateEditor({ editorRef, initialValue, readOnly }) {
  const editor = editorRef.current

  const [value, setValue] = useState(
    Value.fromJSON(JSON.parse(initialValue || defaultInitialValue))
  )

  const onChange = useCallback(({ value }) => {
    setValue(value)
  }, [])

  return (
    <>
      <SlateEditorToolbar editor={editor} />
      <Segment>
        <Container text>
          <Editor
            onChange={onChange}
            ref={editorRef}
            value={value}
            plugins={plugins}
            readOnly={readOnly}
          />
        </Container>
      </Segment>
    </>
  )
}

export default React.forwardRef(({ ...props }, ref) => (
  <SlateEditor {...props} editorRef={ref} />
))
