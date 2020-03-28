import useToggle from 'hooks/useToggle'
import React, { useMemo } from 'react'
import { Modal } from 'semantic-ui-react'
import Editor from './Editor'
import TeX from './TeX'

function InlineTeX({
  children,
  contentState,
  decoratedText,
  dir,
  entityKey,
  offsetKey,
  getStore,
}) {
  const [open, handler] = useToggle(false)

  const readOnly = getStore().getReadOnly()

  const data = useMemo(() => {
    const entity = contentState.getEntity(entityKey)

    const entityData = entity.getData()

    return {
      tex: entityData.tex,
      type: entityData.type,
    }
  }, [contentState, entityKey])

  return readOnly ? (
    <TeX data={data} data-offset-key={offsetKey} />
  ) : (
    <Modal
      closeIcon
      open={open}
      onClose={handler.close}
      trigger={
        <TeX data={data} onClick={handler.open} data-offset-key={offsetKey} />
      }
    >
      <Editor
        isInline
        toUpdate
        children={children}
        contentState={contentState}
        decoratedText={decoratedText}
        dir={dir}
        entityKey={entityKey}
        offsetKey={offsetKey}
        getStore={getStore}
        onClose={handler.close}
      />
    </Modal>
  )
}

export default InlineTeX
