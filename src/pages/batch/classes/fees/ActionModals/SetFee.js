import Form from 'components/Form/Form'
import FormInput from 'components/Form/Input'
import Permit from 'components/Permit'
import { Formik } from 'formik'
import useToggle from 'hooks/useToggle'
import { get } from 'lodash-es'
import React, { useCallback, useMemo } from 'react'
import { connect } from 'react-redux'
import { Button, Message, Modal } from 'semantic-ui-react'
import { setBatchClassFee } from 'store/actions/batches'
import * as Yup from 'yup'

const getValidationSchema = () => {
  return Yup.object({
    amount: Yup.number()
      .integer()
      .min(0)
      .required(`required`)
  })
}

const getInitialValues = batchFee => ({
  amount: get(batchFee, 'amount', 0) / 100
})

function BatchCourseFeeSetModal({
  batchClassId,
  year,
  month,
  monthName,
  batchFee,
  setBatchClassFee
}) {
  const [open, handle] = useToggle(false)

  const initialValues = useMemo(() => getInitialValues(batchFee), [batchFee])
  const validationSchema = useMemo(() => getValidationSchema(), [])

  const onSubmit = useCallback(
    async ({ amount }, actions) => {
      actions.setStatus(null)

      try {
        await setBatchClassFee(batchClassId, year, month, {
          amount: amount * 100
        })
        actions.resetForm()
        handle.close()
      } catch (err) {
        if (err.errors) {
          const errors = []
          err.errors.forEach(({ param, message }) =>
            param !== 'amount'
              ? errors.push(`${param}: ${message}`)
              : actions.setFieldError(param, message)
          )
          if (errors.length) actions.setStatus(errors.join(', '))
        } else if (err.message) {
          actions.setStatus(err.message)
        } else {
          actions.setStatus(null)
          console.error(err)
        }
      }

      actions.setSubmitting(false)
    },
    [batchClassId, handle, month, setBatchClassFee, year]
  )

  return (
    <Permit teacher>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        enableReinitialize
        onSubmit={onSubmit}
      >
        {({ isSubmitting, isValid, status }) => (
          <Modal
            trigger={
              <Button type="button" color="blue" onClick={handle.open}>
                Set
              </Button>
            }
            as={Form}
            closeIcon
            open={open}
            onClose={handle.close}
          >
            <Modal.Header>
              Set Fee for {monthName} {year}
            </Modal.Header>

            <Modal.Content>
              <Message color="yellow" hidden={!status}>
                {status}
              </Message>

              <FormInput
                type="number"
                name="amount"
                label={`Amount (BDT)`}
                min="0"
                step="100"
              />
            </Modal.Content>

            <Modal.Actions>
              <Button type="reset">Reset</Button>
              <Button
                positive
                type="submit"
                loading={isSubmitting}
                disabled={!isValid || isSubmitting}
              >
                Save
              </Button>
            </Modal.Actions>
          </Modal>
        )}
      </Formik>
    </Permit>
  )
}

const mapStateToProps = ({ batches }, { batchClassId, year, month }) => ({
  batchFee: get(batches.classes.feesById, [batchClassId, year, month])
})

const mapDispatchToProps = {
  setBatchClassFee
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BatchCourseFeeSetModal)
