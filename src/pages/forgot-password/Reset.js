import { Link } from '@reach/router'
import Form from 'components/Form/Form'
import FormInput from 'components/Form/Input'
import { Formik } from 'formik'
import React, { useCallback, useMemo, useState } from 'react'
import {
  Button,
  Container,
  FormField,
  FormGroup,
  Header,
  Message,
  Segment,
} from 'semantic-ui-react'
import api from 'utils/api'
import * as Yup from 'yup'

const getValidationSchema = () =>
  Yup.object().shape({
    userId: Yup.number().integer().required(`required`),
    password: Yup.string()
      .min(8, `must be at least 8 characters long`)
      .required(`required`),
    passwordConfirmation: Yup.string()
      .oneOf([Yup.ref('password'), null], `recheck password`)
      .required(`required`),
    token: Yup.string().required(`required`),
  })

const getInitialValues = (userId, token) => ({
  userId,
  password: '',
  passwordConfirmation: '',
  token,
})

function ResetPassword({ userId, token }) {
  const [done, setDone] = useState(false)

  const initialValues = useMemo(() => getInitialValues(userId, token), [
    token,
    userId,
  ])
  const validationSchema = useMemo(() => getValidationSchema(), [])

  const onSubmit = useCallback(async (values, actions) => {
    actions.setStatus(null)

    try {
      const { error } = await api('/auth/action/reset-password', {
        method: 'POST',
        body: values,
      })

      if (error) throw error

      actions.resetForm()
      setDone(true)
    } catch (err) {
      if (err.errors) {
        const errors = []
        err.errors.forEach(({ param, message }) =>
          ['userId', 'token'].includes(param)
            ? errors.push(`${param}: ${message}`)
            : actions.setFieldError(param, message)
        )
        if (errors.length) actions.setStatus(errors.join(', '))
      } else if (err.message) {
        actions.setStatus(err.message)
      } else {
        console.error(err)
        actions.setStatus(null)
      }
    }

    actions.setSubmitting(false)
  }, [])

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {({ isSubmitting, isValid, values, status }) => (
        <Form>
          <Container text textAlign="center" as={Segment}>
            <Header>Password Reset</Header>

            <Message color="yellow" hidden={!status}>
              {status}
            </Message>

            {done ? (
              <Message>
                <p>Password reset successful!</p>
                <p>You can login to your account now!</p>
              </Message>
            ) : (
              <>
                <FormInput
                  name="password"
                  type="password"
                  label={`Password`}
                  icon="lock"
                />
                <FormInput
                  name="passwordConfirmation"
                  type="password"
                  label={`Confirm Password`}
                  icon="lock"
                />
              </>
            )}

            <FormGroup widths="equal">
              <FormField width="6">
                <Button fluid as={Link} to="/login" disabled={!done}>
                  Log In
                </Button>
              </FormField>
              <FormField width="10">
                <Button
                  positive
                  fluid
                  type="submit"
                  loading={isSubmitting}
                  disabled={!isValid || isSubmitting || done}
                >
                  Change Password
                </Button>
              </FormField>
            </FormGroup>
          </Container>
        </Form>
      )}
    </Formik>
  )
}

export default ResetPassword
