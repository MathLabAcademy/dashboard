import FormFile from 'components/Form/File'
import Form from 'components/Form/Form'
import Permit from 'components/Permit'
import { Formik } from 'formik'
import useToggle from 'hooks/useToggle'
import React, { useCallback, useMemo } from 'react'
import { connect } from 'react-redux'
import { Button, Message, Modal } from 'semantic-ui-react'
import { createBatchCourseEnrollmentBulk } from 'store/actions/batches'
import * as Yup from 'yup'

const getValidationSchema = () => {
  return Yup.object({
    dataFile: Yup.mixed().required(`required`)
  })
}

const getInitialValues = () => ({
  dataFile: ''
})

function BatchCourseEnrollmentBulkAddModal({
  batchCourseId,
  year,
  createBatchCourseEnrollmentBulk,
  refreshData
}) {
  const [open, handle] = useToggle(false)

  const initialValues = useMemo(() => getInitialValues(year), [year])
  const validationSchema = useMemo(() => getValidationSchema(), [])

  const onSubmit = useCallback(
    async (values, actions) => {
      actions.setStatus(null)

      try {
        await createBatchCourseEnrollmentBulk({
          batchCourseId,
          year,
          ...values
        })
        actions.resetForm()
        handle.close()
        refreshData()
      } catch (err) {
        if (err.errors) {
          err.errors.forEach(({ param, message }) =>
            param === 'batchCourseId'
              ? actions.setStatus(`${param}: ${message}`)
              : actions.setFieldError(param, message)
          )
        } else if (err.message) {
          actions.setStatus(err.message)
        } else {
          actions.setStatus(null)
          console.error(err)
        }
      }

      actions.setSubmitting(false)
    },
    [batchCourseId, createBatchCourseEnrollmentBulk, handle, refreshData, year]
  )

  return (
    <Permit teacher>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        enableReinitialize
        onSubmit={onSubmit}
      >
        {({ status, isSubmitting, isValid }) => (
          <Modal
            trigger={
              <Button type="button" color="blue" onClick={handle.open}>
                Add Bulk
              </Button>
            }
            as={Form}
            closeIcon
            open={open}
            onClose={handle.close}
          >
            <Modal.Header>
              Add Bulk Batch Course Enrollment for {year}
            </Modal.Header>

            <Modal.Content>
              <Message color="yellow" hidden={!status}>
                {status}
              </Message>

              <FormFile
                name="dataFile"
                label={`Data File`}
                accept=".csv,.xls,.xlsx"
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
                Update
              </Button>
            </Modal.Actions>
          </Modal>
        )}
      </Formik>
    </Permit>
  )
}

const mapStateToProps = null

const mapDispatchToProps = {
  createBatchCourseEnrollmentBulk
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BatchCourseEnrollmentBulkAddModal)
