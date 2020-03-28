import React, { useCallback, useMemo, useState } from 'react'
import { Container, Segment } from 'semantic-ui-react'
import { Value } from 'slate'
import { Editor } from 'slate-react'
import SlateEditorToolbar from './components/toolbar'
import defaultInitialValue from './initialValue'
import InlineFormatPlugin from './plugins/inline-format'
import KatexPlugin from './plugins/katex'
import MarkdownPlugin from './plugins/markdown'
import QueriesPlugin from './plugins/queries'

const plugins = [
  QueriesPlugin(),
  MarkdownPlugin(),
  KatexPlugin(),
  InlineFormatPlugin(),
]

export function SlateViewer({ initialValue, inline = false }) {
  const value = useMemo(
    () =>
      initialValue ? Value.fromJSON(JSON.parse(initialValue)) : Value.create(),
    [initialValue]
  )
  return (
    <Editor
      value={value}
      plugins={plugins}
      readOnly
      style={{ display: `${inline ? 'inline-' : ''}block` }}
    />
  )
}

function SlateEditor({ editorRef, initialValue, readOnly }) {
  const [value, setValue] = useState(
    Value.fromJSON(JSON.parse(initialValue || defaultInitialValue))
  )

  const onChange = useCallback(({ value }) => {
    setValue(value)
  }, [])

  return (
    <>
      <SlateEditorToolbar editor={editorRef.current} />
      <Segment>
        <Container>
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
