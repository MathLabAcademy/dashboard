import FormCheckbox from 'components/Form/Checkbox'
import Form from 'components/Form/Form'
import FormInput from 'components/Form/Input'
import Permit from 'components/Permit'
import { Formik } from 'formik'
import useToggle from 'hooks/useToggle'
import { get } from 'lodash-es'
import React, { useCallback, useEffect, useMemo } from 'react'
import { connect } from 'react-redux'
import { Button, FormGroup, Message, Modal } from 'semantic-ui-react'
import {
  createBatchClassEnrollmentForNewStudent,
  getBatchClassEnrollmentNextSerial,
} from 'store/actions/batches'
import { emptyObject } from 'utils/defaults'
import * as Yup from 'yup'

function FormModal({
  open,
  handle,
  formik: { isSubmitting, isValid, values, status, setFieldValue },
  batchClassId,
  nextSerials,
  getBatchClassEnrollmentNextSerial,
}) {
  useEffect(() => {
    if (open) {
      getBatchClassEnrollmentNextSerial(batchClassId, values.year).then(
        ({ serial }) => {
          setFieldValue('serial', serial)
        }
      )
    }
  }, [
    getBatchClassEnrollmentNextSerial,
    batchClassId,
    values.year,
    open,
    setFieldValue,
  ])

  return (
    <Modal
      trigger={
        <Button type="button" color="blue" onClick={handle.open}>
          New Student
        </Button>
      }
      as={Form}
      closeIcon
      open={open}
      onClose={handle.close}
    >
      <Modal.Header>Add Enrollment</Modal.Header>

      <Modal.Content>
        <Message color="yellow" hidden={!status}>
          {status}
        </Message>

        <FormInput name="fullName" label={`Full Name`} icon="user" />

        <FormInput name="shortName" label={`Short Name`} icon="user" />

        <FormInput
          type="date"
          name="dob"
          label={`Date of Birth`}
          icon="calendar alternate"
          min="1900-01-01"
        />

        <FormInput name="phone" label={`Mobile Phone Number`} icon="phone" />

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
            min={get(nextSerials, [values.year, 'serial'], 1)}
            max="999"
            step="1"
          />
        </FormGroup>

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
    year: Yup.number().integer().min(2000).max(2099).required(`required`),
    serial: Yup.number().integer().min(1).max(999).required(`required`),
    active: Yup.boolean().required(`required`),
    waiver: Yup.number().integer().min(0).max(100).required(`required`),
    fullName: Yup.string().required(`required`),
    shortName: Yup.string().required(`required`),
    dob: Yup.date().notRequired(),
    phone: Yup.string()
      .matches(/^01\d{9}/)
      .required(`required`),
  })
}

const getInitialValues = (year) => ({
  year: year || new Date().getFullYear(),
  serial: '',
  active: true,
  waiver: 0,
  fullName: '',
  shortName: '',
  dob: '',
  phone: '',
})

function BatchClassEnrollmentAddNewStudentModal({
  batchClassId,
  year,
  nextSerials,
  createBatchClassEnrollmentForNewStudent,
  getBatchClassEnrollmentNextSerial,
}) {
  const [open, handle] = useToggle(false)

  const initialValues = useMemo(() => getInitialValues(year), [year])
  const validationSchema = useMemo(() => getValidationSchema(), [])

  const onSubmit = useCallback(
    async (values, actions) => {
      actions.setStatus(null)

      try {
        await createBatchClassEnrollmentForNewStudent({
          batchClassId,
          ...values,
          phone: `+88${values.phone}`,
        })
        actions.resetForm()
        handle.close()
      } catch (err) {
        if (err.errors) {
          err.errors.forEach(({ param, message }) =>
            param === 'batchClassId'
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
    [batchClassId, createBatchClassEnrollmentForNewStudent, handle]
  )

  return (
    <Permit teacher>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        enableReinitialize
        onSubmit={onSubmit}
      >
        {(props) => (
          <FormModal
            formik={props}
            open={open}
            handle={handle}
            batchClassId={batchClassId}
            nextSerials={nextSerials}
            getBatchClassEnrollmentNextSerial={
              getBatchClassEnrollmentNextSerial
            }
          />
        )}
      </Formik>
    </Permit>
  )
}

const mapStateToProps = ({ batches }, { batchClassId }) => ({
  nextSerials: get(
    batches.classes.byId,
    [batchClassId, 'nextSerials'],
    emptyObject
  ),
})

const mapDispatchToProps = {
  createBatchClassEnrollmentForNewStudent,
  getBatchClassEnrollmentNextSerial,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BatchClassEnrollmentAddNewStudentModal)
