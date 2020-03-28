import katex from 'katex'
import 'katex/dist/katex.min.css'
import React, { useMemo } from 'react'

const componentByType = {
  block: 'div',
  inline: 'span',
}

function TeX({ data, onParseError, onClick, ...props }) {
  const { tex, type } = data

  const Component = useMemo(() => componentByType[type], [type])
  const displayMode = useMemo(() => type === 'block', [type])

  const __html = useMemo(() => {
    let html = ''

    try {
      html = katex.renderToString(tex, {
        displayMode,
        throwOnError: typeof onParseError === 'function',
      })
    } catch (err) {
      html = katex.renderToString(tex, { displayMode, throwOnError: false })
      onParseError(err, html)
    }

    return html
  }, [displayMode, onParseError, tex])

  return (
    <Component
      dangerouslySetInnerHTML={{ __html }}
      className={`TeX ${displayMode ? 'tex-block' : 'inline-tex'}`}
      onClick={onClick}
      {...props}
    />
  )
}

export default TeX
