import useToggle from 'hooks/useToggle'
import React, { useMemo } from 'react'
import { Modal } from 'semantic-ui-react'
import Editor from './Editor'

function ImageBlock({ block, blockProps: { getStore }, contentState }) {
  const [open, handler] = useToggle(false)

  const readOnly = getStore().getReadOnly()

  const data = useMemo(() => {
    const blockData = block.getData()

    const rawSrc = blockData.get('src')

    const src = /^s3::/.test(rawSrc)
      ? rawSrc.replace(/^s3::/, '')
      : `/api${rawSrc}`

    return {
      src,
      caption: blockData.get('caption'),
    }
  }, [block])

  return readOnly ? (
    <img src={data.src} alt={data.caption} />
  ) : (
    <Modal
      closeIcon
      open={open}
      onClose={handler.close}
      trigger={<img src={data.src} alt={data.caption} onClick={handler.open} />}
    >
      <Editor
        toUpdate
        block={block}
        contentState={contentState}
        getStore={getStore}
        onClose={handler.close}
      />
    </Modal>
  )
}

export default ImageBlock
