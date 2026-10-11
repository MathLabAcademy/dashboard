import Form from 'components/Form/Form'
import FormInput from 'components/Form/Input'
import Permit from 'components/Permit'
import { Formik } from 'formik'
import useToggle from 'hooks/useToggle'
import React, { useCallback, useMemo } from 'react'
import { connect } from 'react-redux'
import { Button, Message, Modal } from 'semantic-ui-react'
import { createUser } from 'store/actions/users'
import * as Yup from 'yup'

function FormModal({
  open,
  handle,
  formik: { isSubmitting, isValid, status },
}) {
  return (
    <Modal
      trigger={
        <Button type="button" color="blue" onClick={handle.open}>
          Add User
        </Button>
      }
      as={Form}
      closeIcon
      open={open}
      onClose={handle.close}
    >
      <Modal.Header>Add User</Modal.Header>

      <Modal.Content>
        <Message color="yellow" hidden={!status}>
          {status}
        </Message>

        <FormInput name="fullName" label={`Full Name`} icon="user" />

        <FormInput
          name="shortName"
          label={`Short Name`}
          icon="user"
          placeholder="Defaults to Full Name"
        />

        <FormInput
          type="date"
          name="dob"
          label={`Date of Birth`}
          icon="calendar alternate"
          min="1900-01-01"
        />

        <FormInput name="phone" label={`Mobile Phone Number`} icon="phone" />
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
    fullName: Yup.string().min(2).max(255).required(`required`),
    shortName: Yup.string().min(2).max(24).notRequired(),
    dob: Yup.date().notRequired(),
    phone: Yup.string()
      .matches(/^01\d{9}$/)
      .required(`required`),
  })
}

const getInitialValues = () => ({
  fullName: '',
  shortName: '',
  dob: '',
  phone: '',
})

function AddUserModal({ createUser }) {
  const [open, handle] = useToggle(false)

  const initialValues = useMemo(() => getInitialValues(), [])
  const validationSchema = useMemo(() => getValidationSchema(), [])

  const onSubmit = useCallback(
    async (values, actions) => {
      actions.setStatus(null)

      try {
        await createUser({
          ...values,
          phone: `+88${values.phone}`,
        })
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
    [createUser, handle]
  )

  return (
    <Permit roles="teacher">
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {(props) => <FormModal formik={props} open={open} handle={handle} />}
      </Formik>
    </Permit>
  )
}

const mapDispatchToProps = {
  createUser,
}

export default connect(null, mapDispatchToProps)(AddUserModal)
