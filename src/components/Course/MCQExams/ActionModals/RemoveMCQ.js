import Form from 'components/Form/Form'
import HeaderGrid from 'components/HeaderGrid'
import Permit from 'components/Permit'
import useToggle from 'hooks/useToggle'
import React, { useCallback, useState } from 'react'
import { connect } from 'react-redux'
import { Button, Message, Modal } from 'semantic-ui-react'
import { removeQuestionFromMCQExam } from 'store/actions/mcqExams'

function RemoveMCQ({ mcqExamId, mcqId, mcq, removeQuestionFromMCQExam }) {
  const [open, handle] = useToggle(false)

  const [error, setError] = useState(null)

  const [loading, setLoading] = useState(false)

  const onSubmit = useCallback(async () => {
    setError(null)
    setLoading(true)

    try {
      await removeQuestionFromMCQExam(mcqExamId, { mcqId })
    } catch (err) {
      if (err.message) {
        setError(err.message)
      } else {
        setError(null)
        console.error(err)
      }
    }

    setLoading(false)
  }, [mcqExamId, mcqId, removeQuestionFromMCQExam])

  return (
    <Permit roles="teacher">
      <Modal
        trigger={
          <Button type="button" color="red" onClick={handle.open}>
            X
          </Button>
        }
        as={Form}
        closeIcon
        open={open}
        onClose={handle.close}
      >
        <Modal.Header>Remove MCQ [ID:{mcqId}] from this MCQExam</Modal.Header>

        <Modal.Content>Are you sure?</Modal.Content>

        <Modal.Actions>
          <HeaderGrid
            Left={
              <Message color="yellow" hidden={!error}>
                {error}
              </Message>
            }
            Right={
              <>
                <Button type="button" onClick={handle.close}>
                  Cancel
                </Button>
                <Button
                  negative
                  type="submit"
                  loading={loading}
                  disabled={loading}
                  onClick={onSubmit}
                >
                  Remove MCQ
                </Button>
              </>
            }
          />
        </Modal.Actions>
      </Modal>
    </Permit>
  )
}

const mapStateToProps = null

const mapDispatchToProps = {
  removeQuestionFromMCQExam,
}

export default connect(mapStateToProps, mapDispatchToProps)(RemoveMCQ)
