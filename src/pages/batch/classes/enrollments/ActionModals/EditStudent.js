import isMobilePhone from '@muniftanjim/is-mobile-phone-number-bd'
import FormCheckbox from 'components/Form/Checkbox.js'
import Form from 'components/Form/Form.js'
import FormInput from 'components/Form/Input.js'
import Permit from 'components/Permit'
import { Formik } from 'formik'
import useToggle from 'hooks/useToggle.js'
import { get } from 'lodash-es'
import React, { useCallback, useMemo } from 'react'
import { connect } from 'react-redux'
import { Button, Message, Modal } from 'semantic-ui-react'
import { updateBatchStudent } from 'store/actions/batches.js'
import * as Yup from 'yup'

const getValidationSchema = () => {
  return Yup.object({
    fullName: Yup.string().required(`required`),
    shortName: Yup.string().required(`required`),
    phone: Yup.string()
      .test('is-mobile-phone', 'invalid mobile phone number', phone =>
        phone ? isMobilePhone(phone) : true
      )
      .notRequired(),
    guardianPhone: Yup.string()
      .test('is-mobile-phone', 'invalid mobile phone number', phone =>
        phone ? isMobilePhone(phone) : true
      )
      .notRequired(),
    active: Yup.boolean().required(`required`),
    waiver: Yup.number()
      .integer()
      .min(0)
      .max(100)
      .required(`required`)
  })
}

const getInitialValues = batchStudent => ({
  fullName: get(batchStudent, 'fullName', ''),
  shortName: get(batchStudent, 'shortName', ''),
  phone: get(batchStudent, 'phone') || '',
  guardianPhone: get(batchStudent, 'guardianPhone') || '',
  active: get(batchStudent, 'active', false),
  waiver: get(batchStudent, 'waiver', 0)
})

function BatchCourseStudentAddModal({
  batchStudentId,
  batchStudent,
  updateBatchStudent
}) {
  const [open, handle] = useToggle(false)

  const initialValues = useMemo(() => getInitialValues(batchStudent), [
    batchStudent
  ])
  const validationSchema = useMemo(() => getValidationSchema(), [])

  const onSubmit = useCallback(
    async (values, actions) => {
      actions.setStatus(null)

      try {
        await updateBatchStudent(batchStudentId, values)
        actions.resetForm()
        handle.close()
      } catch (err) {
        if (err.errors) {
          err.errors.forEach(({ param, message }) =>
            actions.setFieldError(param, message)
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
    [batchStudentId, handle, updateBatchStudent]
  )

  return (
    <Permit teacher>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        enableReinitialize
        onSubmit={onSubmit}
      >
        {({ isSubmitting, isValid, values, status, setFieldValue }) => (
          <Modal
            trigger={
              <Button type="button" color="blue" onClick={handle.open}>
                Edit
              </Button>
            }
            as={Form}
            closeIcon
            open={open}
            onClose={handle.close}
          >
            <Modal.Header>
              Edit Student: {String(batchStudentId).padStart(7, '0')}
            </Modal.Header>

            <Modal.Content>
              <Message color="yellow" hidden={!status}>
                {status}
              </Message>

              <FormInput name="fullName" label={`Full Name`} />
              <FormInput name="shortName" label={`Short Name`} />

              <FormInput name="phone" label={`Mobile Number`} icon="phone" />

              <FormInput
                name="guardianPhone"
                label={`Guardian's Mobile Number`}
                icon="phone"
              />

              <FormCheckbox name="active" label={`Active`} />

              <FormInput name="waiver" label={`% Waiver`} />
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

const mapStateToProps = ({ batches }, { batchStudentId }) => ({
  batchStudent: get(batches.students.byId, batchStudentId)
})

const mapDispatchToProps = {
  updateBatchStudent
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BatchCourseStudentAddModal)
