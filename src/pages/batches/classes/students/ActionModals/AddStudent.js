import isMobilePhone from '@muniftanjim/is-mobile-phone-number-bd'
import FormCheckbox from 'components/Form/Checkbox.js'
import Form from 'components/Form/Form.js'
import FormInput from 'components/Form/Input.js'
import Permit from 'components/Permit'
import { Formik } from 'formik'
import useToggle from 'hooks/useToggle.js'
import React, { useCallback, useEffect, useMemo } from 'react'
import { connect } from 'react-redux'
import { Button, FormGroup, Message, Modal } from 'semantic-ui-react'
import {
  createBatchStudent,
  getBatchStudentNextId
} from 'store/actions/batches.js'
import * as Yup from 'yup'

function FormModal({
  batchClassId,
  getBatchStudentNextId,
  open,
  handle,
  formik: { isSubmitting, isValid, values, status, setFieldValue }
}) {
  const nextIdQuery = useMemo(() => {
    return `filter=${JSON.stringify({
      year: { '=': Number(values.year) },
      batchClassId: { '=': Number(batchClassId) }
    })}`
  }, [batchClassId, values.year])

  useEffect(() => {
    if (open) {
      getBatchStudentNextId({ query: nextIdQuery }).then(id => {
        setFieldValue(
          'serial',
          Number(
            String(id)
              .padStart(7, '0')
              .substring(4, 7)
          )
        )
      })
    }
  }, [getBatchStudentNextId, nextIdQuery, open, setFieldValue])

  return (
    <Modal
      trigger={
        <Button type="button" color="blue" onClick={handle.open}>
          Add Student
        </Button>
      }
      as={Form}
      closeIcon
      open={open}
      onClose={handle.close}
    >
      <Modal.Header>Add Student</Modal.Header>

      <Modal.Content>
        <Message color="yellow" hidden={!status}>
          {status}
        </Message>

        <FormGroup widths="equal">
          <FormInput
            type="number"
            name="year"
            label={`Year`}
            min="2000"
            max="2099"
            step="1"
          />
          <FormInput
            type="number"
            name="serial"
            label={`Serial`}
            min="0"
            max="999"
            step="1"
          />
        </FormGroup>

        <FormInput name="fullName" label={`Name`} />

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
  )
}

const getValidationSchema = () => {
  return Yup.object({
    year: Yup.number()
      .integer()
      .min(2000)
      .max(2099)
      .required(`required`),
    serial: Yup.number()
      .integer()
      .min(0)
      .max(999)
      .required(`required`),
    fullName: Yup.string().required(`required`),
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

const getInitialValues = year => ({
  year: year || new Date().getFullYear(),
  serial: '',
  fullName: '',
  phone: '',
  guardianPhone: '',
  active: true,
  waiver: 0
})

function BatchCourseStudentAddModal({
  batchClassId,
  year,
  createBatchStudent,
  nextId,
  getBatchStudentNextId
}) {
  const [open, handle] = useToggle(false)

  const initialValues = useMemo(() => getInitialValues(year), [year])
  const validationSchema = useMemo(() => getValidationSchema(), [])

  const onSubmit = useCallback(
    async ({ year, serial, ...values }, actions) => {
      actions.setStatus(null)

      const id = Number(
        `${String(year).substring(2, 4)}${String(batchClassId).padStart(
          2,
          '0'
        )}${String(serial).padStart(3, '0')}`
      )

      try {
        await createBatchStudent({ id, ...values })
        actions.resetForm()
        handle.close()
      } catch (err) {
        if (err.errors) {
          err.errors.forEach(({ param, message }) =>
            param === 'id'
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
    [batchClassId, createBatchStudent, handle]
  )

  return (
    <Permit teacher>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        enableReinitialize
        onSubmit={onSubmit}
      >
        {props => (
          <FormModal
            formik={props}
            open={open}
            handle={handle}
            batchClassId={batchClassId}
            nextId={nextId}
            getBatchStudentNextId={getBatchStudentNextId}
          />
        )}
      </Formik>
    </Permit>
  )
}

const mapStateToProps = ({ batches }) => ({
  nextId: batches.students.nextId
})

const mapDispatchToProps = {
  createBatchStudent,
  getBatchStudentNextId
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BatchCourseStudentAddModal)
