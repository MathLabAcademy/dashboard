import isMobilePhone from '@muniftanjim/is-mobile-phone-number-bd'
import Form from 'components/Form/Form.js'
import Input from 'components/Form/Input.js'
import { Formik } from 'formik'
import React, { useCallback, useMemo } from 'react'
import {
  Button,
  FormField,
  FormGroup,
  Header,
  Message,
  Segment
} from 'semantic-ui-react'
import api from 'utils/api'
import * as Yup from 'yup'

const getValidationSchema = () => {
  return Yup.object().shape({
    email: Yup.string()
      .email(`invalid email`)
      .required(`required`),
    password: Yup.string()
      .min(8, `must be at least 8 characters long`)
      .required(`required`),
    passwordConfirmation: Yup.string()
      .oneOf([Yup.ref('password'), null], `recheck password`)
      .required(`required`),
    fullName: Yup.string().required(`required`),
    shortName: Yup.string().required(`required`),
    dob: Yup.date().notRequired(),
    phone: Yup.string().test(
      'is-mobile-phone',
      'invalid mobile phone number',
      phone => (phone ? isMobilePhone(phone) : true)
    ),
    Guardian: Yup.object({
      fullName: Yup.string().required(`required`),
      shortName: Yup.string().required(`required`),
      email: Yup.string()
        .email(`invalid email`)
        .notRequired(),
      phone: Yup.string().test(
        'is-mobile-phone',
        'invalid mobile phone number',
        phone => (phone ? isMobilePhone(phone) : true)
      )
    })
  })
}

const initialValues = {
  password: '',
  passwordConfirmation: '',
  fullName: '',
  shortName: '',
  dob: '',
  email: '',
  phone: '',
  Guardian: {
    fullName: '',
    shortName: '',
    email: '',
    phone: ''
  }
}

function RegisterForm({ onSuccess }) {
  const validationSchema = useMemo(() => getValidationSchema(), [])

  const onSubmit = useCallback(
    async (values, actions) => {
      actions.setStatus(null)

      const { data, error } = await api('/users/action/register', {
        method: 'POST',
        body: values
      })

      actions.setSubmitting(false)

      if (error) {
        if (error.errors) {
          error.errors.forEach(({ param, message }) =>
            actions.setFieldError(param, message)
          )
        } else if (error.message) {
          actions.setStatus(error.message)
        } else {
          throw error
        }
      }

      if (data) onSuccess(data)
    },
    [onSuccess]
  )

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {({ isSubmitting, isValid, status }) => (
        <Form size="large">
          <Message color="yellow" hidden={!status}>
            {status}
          </Message>

          <Segment>
            <Input name="fullName" label={`Full Name`} icon="user" />

            <Input name="shortName" label={`Short Name`} icon="user" />

            <Input
              type="date"
              name="dob"
              label={`Date of Birth`}
              icon="calendar alternate"
              min="1900-01-01"
            />

            <FormGroup widths="equal">
              <Input
                type="email"
                name="email"
                label={`Email`}
                icon="envelope"
              />

              <Input name="phone" label={`Mobile Phone Number`} icon="phone" />
            </FormGroup>

            <Input
              type="password"
              name="password"
              label={`Password`}
              icon="lock"
            />

            <Input
              type="password"
              name="passwordConfirmation"
              label={`Confirm Password`}
              icon="lock"
            />

            <Segment secondary>
              <Header>Guardian's Information</Header>

              <Input name="Guardian.fullName" label={`Full Name`} icon="user" />

              <Input
                name="Guardian.shortName"
                label={`Short Name`}
                icon="user"
              />

              <FormGroup widths="equal">
                <Input
                  name="Guardian.email"
                  type="email"
                  label={`Email`}
                  icon="envelope"
                />

                <Input
                  name="Guardian.phone"
                  label={`Mobile Phone Number`}
                  icon="phone"
                />
              </FormGroup>
            </Segment>

            <FormGroup widths="equal">
              <FormField width="4">
                <Button type="reset" fluid>
                  Clear
                </Button>
              </FormField>
              <FormField width="12">
                <Button
                  type="submit"
                  fluid
                  positive
                  loading={isSubmitting}
                  disabled={!isValid || isSubmitting}
                >
                  Register
                </Button>
              </FormField>
            </FormGroup>
          </Segment>
        </Form>
      )}
    </Formik>
  )
}

export default RegisterForm
