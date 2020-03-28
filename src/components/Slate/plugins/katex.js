import katex from 'katex'
import 'katex/dist/katex.min.css'
import React, { useCallback, useRef } from 'react'
import { Popup } from 'semantic-ui-react'

function KaTeX({ displayMode, Component, nodeProps, children }) {
  const context = useRef(null)
  const renderHtmlString = useCallback(
    (tex) => {
      return katex.renderToString(tex, {
        displayMode,
        throwOnError: false,
      })
    },
    [displayMode]
  )

  const onClick = useCallback(() => {
    nodeProps.editor.moveToEndOfNode(nodeProps.node).focus()
  }, [nodeProps.editor, nodeProps.node])

  return nodeProps.isFocused ? (
    <Popup
      open={nodeProps.isFocused}
      context={context}
      hideOnScroll
      position="top center"
      trigger={
        <Component
          ref={context}
          {...nodeProps.attributes}
          style={displayMode ? { margin: '1em 0', textAlign: 'center' } : null}
        >
          {children}
        </Component>
      }
      content={
        <Component
          dangerouslySetInnerHTML={{
            __html: renderHtmlString(nodeProps.node.text),
          }}
        />
      }
    />
  ) : (
    <Component
      {...nodeProps.attributes}
      style={{ cursor: 'pointer' }}
      dangerouslySetInnerHTML={{
        __html: renderHtmlString(nodeProps.node.text),
      }}
      onClick={onClick}
    />
  )
}

function TeX({ block, ...props }) {
  return (
    <KaTeX displayMode={block} Component={block ? 'div' : 'span'} {...props} />
  )
}

function onBackspace(event, editor, next) {
  const { value } = editor
  const { selection } = value

  if (selection.isExpanded) return next()

  if (selection.start.offset !== 0) return next()

  if (!editor.hasInline('inline-tex')) return next()

  event.preventDefault()
  editor.unwrapInline('inline-tex').deleteBackward()
}

function KatexPlugin(options = {}) {
  function renderBlock(props, editor, next) {
    const { children, node } = props

    switch (node.type) {
      case 'tex-block':
        return (
          <TeX block nodeProps={props}>
            {children}
          </TeX>
        )
      default:
        return next()
    }
  }

  function renderInline(props, editor, next) {
    const { children, node } = props

    switch (node.type) {
      case 'inline-tex':
        return <TeX nodeProps={props}>{children}</TeX>
      default:
        return next()
    }
  }

  function onKeyDown(event, editor, next) {
    switch (event.key) {
      case 'Backspace':
        return onBackspace(event, editor, next)
      default:
        return next()
    }
  }

  return {
    renderBlock,
    renderInline,
    onKeyDown,
  }
}

export default KatexPlugin
