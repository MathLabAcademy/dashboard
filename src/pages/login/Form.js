import React, { useMemo } from 'react'

import { connect } from 'react-redux'
import { logIn } from 'store/actions/currentUser.js'

import { Formik } from 'formik'
import * as Yup from 'yup'

import { Button, Message, Segment } from 'semantic-ui-react'

import Form from 'components/Form/Form.js'
import Input from 'components/Form/Input.js'

const getValidationSchema = () => {
  return Yup.object().shape({
    email: Yup.string().required(`required`),
    password: Yup.string().required(`required`)
  })
}

function LogInForm({ logIn }) {
  const validationSchema = useMemo(() => getValidationSchema(), [])

  return (
    <Formik
      initialValues={{ email: '', password: '' }}
      validationSchema={validationSchema}
      onSubmit={async (values, actions) => {
        actions.setStatus(null)

        try {
          await logIn(values)
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
      {({ isSubmitting, isValid, status }) => (
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

            <Button
              fluid
              positive
              size="large"
              type="submit"
              loading={isSubmitting}
              disabled={!isValid || isSubmitting}
            >
              Log In
            </Button>
          </Segment>
        </Form>
      )}
    </Formik>
  )
}

const mapDispatchToProps = {
  logIn
}

export default connect(
  null,
  mapDispatchToProps
)(LogInForm)
