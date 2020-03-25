import Form from 'components/Form/Form'
import Input from 'components/Form/Input'
import { Formik } from 'formik'
import React, { useCallback, useState } from 'react'
import { connect } from 'react-redux'
import {
  Button,
  FormField,
  FormGroup,
  Message,
  Segment,
} from 'semantic-ui-react'
import { loginWithPhone } from 'store/currentUser'
import api from 'utils/api'
import * as Yup from 'yup'

function PhoneLoginRequest({ setPhone, setToken }) {
  return (
    <Formik
      initialValues={{ phone: '' }}
      validationSchema={Yup.object().shape({
        phone: Yup.string()
          .matches(/01\d{9}/)
          .required(`required`),
      })}
      onSubmit={async ({ phone }, actions) => {
        actions.setStatus(null)

        try {
          const { data, error } = await api('/auth/login/phone/init', {
            method: 'POST',
            body: {
              phone: `+88${phone}`,
            },
          })

          if (error) {
            throw error
          }

          setPhone(data.phone)
          setToken(data.token)
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
      }}
    >
      {({ isSubmitting, isValid, values, status }) => (
        <Form size="large">
          <Message color="yellow" hidden={!status}>
            {status}
          </Message>

          <Segment>
            <Input name="phone" label={`Phone`} icon="phone" />

            <FormGroup widths="equal">
              <FormField>
                <Button
                  fluid
                  positive
                  type="submit"
                  loading={isSubmitting}
                  disabled={!isValid || isSubmitting}
                >
                  Request OTP Code
                </Button>
              </FormField>
            </FormGroup>
          </Segment>
        </Form>
      )}
    </Formik>
  )
}

function PhoneLoginForm({ loginWithPhone }) {
  const [phone, setPhone] = useState('')
  const [token, setToken] = useState('')

  const onSubmit = useCallback(
    async ({ code }, actions) => {
      actions.setStatus(null)

      try {
        await loginWithPhone({ phone, code, token })
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
    [phone, token, loginWithPhone]
  )

  return phone && token ? (
    <Formik
      initialValues={{ code: '' }}
      validationSchema={Yup.object().shape({
        code: Yup.string().required(`required`),
      })}
      onSubmit={onSubmit}
    >
      {({ isSubmitting, isValid, values, status }) => (
        <Form size="large">
          <Message color="yellow" hidden={!status}>
            {status}
          </Message>

          <Segment>
            <Input name="code" label={`OTP Code`} icon="lock" />

            <FormGroup widths="equal">
              <FormField width="10">
                <Button
                  fluid
                  positive
                  type="submit"
                  loading={isSubmitting}
                  disabled={!phone || !token || !isValid || isSubmitting}
                >
                  Log In
                </Button>
              </FormField>
            </FormGroup>
          </Segment>
        </Form>
      )}
    </Formik>
  ) : (
    <PhoneLoginRequest setPhone={setPhone} setToken={setToken} />
  )
}

const mapDispatchToProps = {
  loginWithPhone,
}

export default connect(null, mapDispatchToProps)(PhoneLoginForm)
