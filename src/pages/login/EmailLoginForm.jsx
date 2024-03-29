import { Link } from 'react-router-dom'
import Form from 'components/Form/Form'
import Input from 'components/Form/Input'
import { Formik } from 'formik'
import React, { useCallback, useMemo } from 'react'
import { connect } from 'react-redux'
import {
  Button,
  FormField,
  FormGroup,
  Message,
  Segment,
} from 'semantic-ui-react'
import { logIn } from 'store/currentUser'
import { trackEventAnalytics } from 'utils/analytics'
import * as Yup from 'yup'

const getValidationSchema = () => {
  return Yup.object().shape({
    email: Yup.string().required(`required`),
    password: Yup.string().required(`required`),
  })
}

const initialValues = { email: '', password: '' }

function EmailLogInForm({ logIn }) {
  const validationSchema = useMemo(() => getValidationSchema(), [])

  const onSubmit = useCallback(
    async (values, actions) => {
      actions.setStatus(null)

      try {
        await logIn(values)

        trackEventAnalytics({
          category: 'User',
          action: 'Logged In with Email',
        })
      } catch (err) {
        if (err.errors) {
          err.errors.forEach(({ param, message }) =>
            actions.setFieldError(param, message)
          )
        }

        if (err.message) {
          actions.setStatus(err.message)
        } else {
          actions.setStatus(null)
          console.error(err)
        }
      }

      actions.setSubmitting(false)
    },
    [logIn]
  )

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {({ isSubmitting, isValid, values, status }) => (
        <Form size="large">
          <Message color="yellow" hidden={!status}>
            {status}
          </Message>

          <Segment>
            <Input type="email" name="email" label={`Email`} icon="envelope" />

            <Input
              type="password"
              name="password"
              label={`Password`}
              icon="lock"
            />

            <FormGroup widths="equal">
              <FormField width="6">
                <Button
                  basic
                  fluid
                  as={Link}
                  to={`/forgot-password?email=${values.email}`}
                >
                  Forgot Password?
                </Button>
              </FormField>
              <FormField width="10">
                <Button
                  fluid
                  positive
                  type="submit"
                  loading={isSubmitting}
                  disabled={!isValid || isSubmitting}
                >
                  Log In
                </Button>
              </FormField>
            </FormGroup>
          </Segment>
        </Form>
      )}
    </Formik>
  )
}

const mapDispatchToProps = {
  logIn,
}

export default connect(null, mapDispatchToProps)(EmailLogInForm)
