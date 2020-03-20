import Permit from 'components/Permit'
import useToggle from 'hooks/useToggle'
import { get } from 'lodash-es'
import React, { useCallback, useMemo, useState } from 'react'
import { connect } from 'react-redux'
import { Button, Confirm, Message, ModalContent } from 'semantic-ui-react'
import { unsetBatchClassFee } from 'store/actions/batches'

function BatchCourseFeeUnsetModal({
  batchClassId,
  year,
  month,
  monthName,
  batchFee,
  unsetBatchClassFee
}) {
  const [open, handler] = useToggle(false)
  const [status, setStatus] = useState(null)

  const handleConfirm = useCallback(async () => {
    setStatus(null)

    try {
      await unsetBatchClassFee(batchClassId, year, month)
      handler.close()
    } catch (err) {
      const errorMessages = []

      if (err.errors) {
        err.errors.forEach(({ param, message }) =>
          message.push(`${param}: ${message}`)
        )
      } else if (err.message) {
        errorMessages.push(`${err.message}`)
      } else {
        console.error(err)
      }

      setStatus(errorMessages.join(', ') || null)
    }
  }, [batchClassId, handler, month, unsetBatchClassFee, year])

  const isSet = useMemo(() => Number.isFinite(get(batchFee, 'amount')), [
    batchFee
  ])

  if (!isSet) return null

  return (
    <Permit teacher>
      <Button onClick={handler.open}>Clear</Button>
      <Confirm
        open={open}
        onCancel={handler.close}
        onConfirm={handleConfirm}
        header={`Clear Fee for ${monthName} ${year}?`}
        content={
          <ModalContent>
            <p>Are you sure?</p>
            <Message color="yellow" hidden={!status}>
              {status}
            </Message>
          </ModalContent>
        }
        confirmButton="Clear Fee"
      />
    </Permit>
  )
}

const mapStateToProps = ({ batches }, { batchClassId, year, month }) => ({
  batchFee: get(batches.classes.feesById, [batchClassId, year, month])
})

const mapDispatchToProps = {
  unsetBatchClassFee
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BatchCourseFeeUnsetModal)
