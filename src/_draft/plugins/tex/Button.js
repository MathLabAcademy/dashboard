import useToggle from 'hooks/useToggle.js'
import React from 'react'
import { Button, Modal } from 'semantic-ui-react'
import Editor from './Editor.js'

function TeXButton({ getStore }) {
  const [open, handler] = useToggle(false)

  return (
    <Modal
      closeIcon
      open={open}
      onClose={handler.close}
      trigger={<Button type="button" onClick={handler.open} content={`TeX`} />}
    >
      <Editor getStore={getStore} onClose={handler.close} />
    </Modal>
  )
}

export default TeXButton
