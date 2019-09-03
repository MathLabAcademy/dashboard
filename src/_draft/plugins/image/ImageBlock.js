import useToggle from 'hooks/useToggle.js'
import React, { useMemo } from 'react'
import { Modal } from 'semantic-ui-react'
import Editor from './Editor.js'

function ImageBlock({ block, blockProps: { getStore }, contentState }) {
  const [open, handler] = useToggle(false)

  const readOnly = getStore().getReadOnly()

  const data = useMemo(() => {
    const blockData = block.getData()

    return {
      src: blockData.get('src'),
      caption: blockData.get('caption')
    }
  }, [block])

  return readOnly ? (
    <img src={`/api${data.src}`} alt={data.caption} />
  ) : (
    <Modal
      closeIcon
      open={open}
      onClose={handler.close}
      trigger={
        <img
          src={`/api${data.src}`}
          alt={data.caption}
          onClick={handler.open}
        />
      }
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
