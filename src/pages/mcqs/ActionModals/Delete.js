import Form from 'components/Form/Form'
import Permit from 'components/Permit'
import useToggle from 'hooks/useToggle'
import React, { useCallback, useState } from 'react'
import { useDispatch } from 'react-redux'
import { Button, Modal } from 'semantic-ui-react'
import { deleteMCQ } from 'store/actions/mcqs'
import { trackEventAnalytics } from 'utils/analytics'

function MCQDeleteModal({ mcqId }) {
  const [open, handle] = useToggle(false)
  const [loading, setLoading] = useState(false)

  const dispatch = useDispatch()
  const onSubmit = useCallback(async () => {
    setLoading(true)

    try {
      await dispatch(deleteMCQ(mcqId))
      trackEventAnalytics({
        category: 'Teacher',
        action: 'Deleted MCQ',
      })
      handle.close()
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [dispatch, handle, mcqId])

  return (
    <Permit roles="teacher,analyst,assistant">
      <Modal
        trigger={
          <Button type="button" color="red" onClick={handle.open}>
            Delete
          </Button>
        }
        as={Form}
        closeIcon
        open={open}
        onClose={handle.close}
      >
        <Modal.Header>Delete MCQ #{mcqId} ?!</Modal.Header>

        <Modal.Content>Are you sure?!</Modal.Content>

        <Modal.Actions>
          <Button onClick={handle.close}>Cancel</Button>
          <Button
            negative
            loading={loading}
            disabled={loading}
            onClick={onSubmit}
          >
            Delete
          </Button>
        </Modal.Actions>
      </Modal>
    </Permit>
  )
}

export default MCQDeleteModal
