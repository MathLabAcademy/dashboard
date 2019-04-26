import React, { useCallback, useMemo } from 'react'

import { connect } from 'react-redux'
import { updatePassword } from 'store/actions/currentUser.js'

import useToggle from 'hooks/useToggle.js'

import { Formik } from 'formik'
import * as Yup from 'yup'

import { Modal, Header, Message, Button } from 'semantic-ui-react'

import Form from 'components/Form/Form.js'
import Input from 'components/Form/Input.js'

const getValidationSchema = () => {
  return Yup.object({
    currentPassword: Yup.string().required(`required`),
    password: Yup.string()
      .min(8, `must be at least 8 characters long`)
      .required(`required`),
    passwordConfirmation: Yup.string()
      .oneOf([Yup.ref('password'), null], `recheck password`)
      .required(`required`)
  })
}

const initialValues = {
  currentPassword: '',
  password: '',
  passwordConfirmation: ''
}

function ProfilePasswordEditor({ updatePassword }) {
  const [open, handle] = useToggle(false)

  const validationSchema = useMemo(() => getValidationSchema(), [])

  const onSubmit = useCallback(
    async (values, actions) => {
      actions.setStatus(null)

      try {
        await updatePassword(values)
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
    [handle, updatePassword]
  )

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {({ isSubmitting, isValid, status }) => (
        <Modal
          trigger={
            <Button type="button" size="small" onClick={handle.open}>
              Change Password
            </Button>
          }
          closeIcon
          open={open}
          onClose={handle.close}
          as={Form}
        >
          <Header>Change Password</Header>

          <Modal.Content>
            <Message color="yellow" hidden={!status}>
              {status}
            </Message>

            <Input name="currentPassword" label={`Current Password`} />

            <Input name="password" label={`Password`} />

            <Input name="passwordConfirmation" label={`Confirm Password`} />
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
  )
}

const mapStateToProps = null

const mapDispatchToProps = {
  updatePassword
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProfilePasswordEditor)
