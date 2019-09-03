import useToggle from 'hooks/useToggle.js'
import React, { useMemo } from 'react'
import { Modal } from 'semantic-ui-react'
import Editor from './Editor.js'
import TeX from './TeX.js'

function TeXBlock({ block, blockProps: { getStore }, contentState }) {
  const [open, handler] = useToggle(false)

  const readOnly = getStore().getReadOnly()

  const data = useMemo(() => {
    const blockData = block.getData()

    return {
      tex: blockData.get('tex'),
      type: blockData.get('type')
    }
  }, [block])

  return readOnly ? (
    <TeX data={data} />
  ) : (
    <Modal
      closeIcon
      open={open}
      onClose={handler.close}
      trigger={<TeX data={data} onClick={handler.open} />}
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

export default TeXBlock
