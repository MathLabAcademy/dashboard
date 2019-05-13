import React, { useCallback } from 'react'
import { Icon, Menu, Popup } from 'semantic-ui-react'
import { Text } from 'slate'

const DEFAULT_NODE = 'paragraph'

function MarkToggler({ editor, type, content, icon, popup }) {
  const onClick = useCallback(
    event => {
      event.preventDefault()

      if (type === 'inline-tex') {
        const { selection } = editor.value

        const isActive = editor.hasInline(type)

        if (isActive) {
          editor.unwrapInline(type).focus()
          return
        }

        if (
          selection.isCollapsed ||
          editor.value.blocks.size > 1 ||
          editor.value.texts.size > 1
        )
          return

        const currentTextNode = editor.value.texts.get(0)

        if (currentTextNode.marks.size) return

        editor
          .insertInline({
            nodes: [Text.create({ text: editor.value.fragment.text })],
            type
          })
          .focus()

        return
      }

      editor.toggleMark(type)
    },
    [editor, type]
  )

  let active = editor.query('hasMark', type)

  if (type === 'inline-tex') {
    active = editor.query('hasInline', 'inline-tex')
  }

  return (
    <Popup
      disabled={!popup}
      trigger={
        <Menu.Item active={active} onClick={onClick}>
          {content ? content : <Icon name={icon} />}
        </Menu.Item>
      }
      content={popup}
    />
  )
}

function BlockToggler({ editor, type, content, icon, popup }) {
  let active = editor.query('hasBlock', type)

  if (['numbered-list', 'bulleted-list'].includes(type)) {
    const {
      value: { document, blocks }
    } = editor

    if (blocks.size > 0) {
      const parent = document.getParent(blocks.first().key)
      active =
        editor.query('hasBlock', 'list-item') && parent && parent.type === type
    }
  }

  const onClick = useCallback(
    event => {
      event.preventDefault()

      const { value } = editor
      const { document } = editor.value

      // Handle everything but list buttons.
      if (type !== 'bulleted-list' && type !== 'numbered-list') {
        const isActive = editor.hasBlock(type)
        const isList = editor.hasBlock('list-item')

        if (isList) {
          editor
            .setBlocks(isActive ? DEFAULT_NODE : type)
            .unwrapBlock('bulleted-list')
            .unwrapBlock('numbered-list')
        } else {
          editor.setBlocks(isActive ? DEFAULT_NODE : type).focus()
        }
      } else {
        // Handle the extra wrapping required for list buttons.
        const isList = editor.hasBlock('list-item')
        const isType = value.blocks.some(block => {
          return !!document.getClosest(
            block.key,
            parent => parent.type === type
          )
        })

        if (isList && isType) {
          editor
            .setBlocks(DEFAULT_NODE)
            .unwrapBlock('bulleted-list')
            .unwrapBlock('numbered-list')
        } else if (isList) {
          editor
            .unwrapBlock(
              type === 'bulleted-list' ? 'numbered-list' : 'bulleted-list'
            )
            .wrapBlock(type)
        } else {
          editor.setBlocks('list-item').wrapBlock(type)
        }
      }
    },
    [editor, type]
  )

  return (
    <Popup
      disabled={!popup}
      trigger={
        <Menu.Item active={active} onClick={onClick}>
          {content ? content : <Icon name={icon} />}
        </Menu.Item>
      }
      content={popup}
    />
  )
}

export function SlateEditorToolbar({ editor }) {
  return (
    <Menu icon secondary size="small">
      {editor ? (
        <>
          <MarkToggler editor={editor} type="bold" icon="bold" />
          <MarkToggler editor={editor} type="italic" icon="italic" />
          <MarkToggler editor={editor} type="code" icon="code" />
          <MarkToggler editor={editor} type="underlined" icon="underline" />
          <MarkToggler
            editor={editor}
            type="inline-tex"
            content={`TeX`}
            popup={`Inline`}
          />

          <Menu.Menu position="right">
            <BlockToggler editor={editor} type="heading-one" icon="heading" />
            <BlockToggler
              editor={editor}
              type="block-quote"
              icon="quote left"
            />
            <BlockToggler editor={editor} type="bulleted-list" icon="list ul" />
            <BlockToggler editor={editor} type="numbered-list" icon="list ol" />
            <BlockToggler
              editor={editor}
              type="tex-block"
              content={`TeX`}
              popup={`Block`}
            />
          </Menu.Menu>
        </>
      ) : (
        <>
          <Menu.Item icon>
            <span>
              <Icon name="arrow down" /> Write Here...
            </span>
          </Menu.Item>
        </>
      )}
    </Menu>
  )
}

export default SlateEditorToolbar
