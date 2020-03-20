import useToggle from 'hooks/useToggle'
import React from 'react'
import { Button, Modal } from 'semantic-ui-react'
import Editor from './Editor'

function ImageButton({ store }) {
  const [open, handler] = useToggle(false)

  return (
    <Modal
      closeIcon
      open={open}
      onClose={handler.close}
      trigger={<Button type="button" onClick={handler.open} icon="image" />}
    >
      <Editor store={store} onClose={handler.close} />
    </Modal>
  )
}

export default ImageButton
