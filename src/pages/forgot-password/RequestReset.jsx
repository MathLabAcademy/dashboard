import { Link } from '@reach/router'
import Form from 'components/Form/Form'
import FormInput from 'components/Form/Input'
import { Formik } from 'formik'
import queryString from 'query-string'
import React, { useCallback, useMemo, useState } from 'react'
import {
  Button,
  Container,
  FormField,
  FormGroup,
  Message,
  Segment,
} from 'semantic-ui-react'
import { trackEventAnalytics } from 'utils/analytics'
import api from 'utils/api'
import * as Yup from 'yup'

const getValidationSchema = () =>
  Yup.object().shape({
    email: Yup.string().email(`invalid email`).required(`required`),
  })

const getInitialValues = (email) => ({
  email: email || '',
})

function RequestPasswordReset({ location }) {
  const [sent, setSent] = useState(false)

  const email = useMemo(() => {
    return queryString.parse(location.search).email
  }, [location.search])

  const initialValues = useMemo(() => getInitialValues(email), [email])
  const validationSchema = useMemo(() => getValidationSchema(), [])

  const onSubmit = useCallback(async (values, actions) => {
    actions.setStatus(null)

    try {
      await api('/auth/action/request-password-reset', {
        method: 'POST',
        body: values,
      })

      trackEventAnalytics({
        category: 'User',
        action: `Requested Password Reset`,
      })

      setSent(true)
    } catch (err) {
      if (err.message) {
        actions.setStatus(err.message)
      } else {
        actions.setStatus(null)
        console.error(err)
      }
    }

    actions.setSubmitting(false)
  }, [])

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      isInitialValid={Boolean(email)}
      onSubmit={onSubmit}
    >
      {({ isSubmitting, isValid, values, status }) => (
        <Form>
          <Container text textAlign="center" as={Segment}>
            <Message color="yellow" hidden={!status}>
              {status}
            </Message>

            {sent ? (
              <Message>
                <p>
                  If an account exists for <strong>{values.email}</strong>, an
                  email will be sent with further instructions to reset your
                  password.
                </p>
                <p>
                  <em>Didn't receive the email?</em>
                  <br />
                  <em>
                    Wait a few minutes and make sure you've checked your spam
                    folder!
                  </em>
                </p>
              </Message>
            ) : (
              <FormInput
                name="email"
                type="email"
                label={`Enter your email address`}
                placeholder={`Email`}
                icon="envelope"
              />
            )}

            <FormGroup widths="equal">
              <FormField width="6">
                <Button fluid as={Link} to="/login">
                  Go Back
                </Button>
              </FormField>
              <FormField width="10">
                <Button
                  positive
                  fluid
                  type="submit"
                  loading={isSubmitting}
                  disabled={!isValid || isSubmitting || sent}
                >
                  Request Reset
                </Button>
              </FormField>
            </FormGroup>
          </Container>
        </Form>
      )}
    </Formik>
  )
}

export default RequestPasswordReset
