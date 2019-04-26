import React, { useCallback, useMemo } from 'react'

import isMobilePhone from '@muniftanjim/is-mobile-phone-number-bd'

import api from 'utils/api.js'

import { Formik } from 'formik'
import * as Yup from 'yup'

import {
  Button,
  FormField,
  FormGroup,
  Message,
  Segment,
  Header
} from 'semantic-ui-react'

import Form from 'components/Form/Form.js'
import Input from 'components/Form/Input.js'

const getValidationSchema = () => {
  return Yup.object().shape({
    email: Yup.string()
      .email()
      .required(`required`),
    password: Yup.string()
      .min(8, `must be at least 8 characters long`)
      .required(`required`),
    passwordConfirmation: Yup.string()
      .oneOf([Yup.ref('password'), null], `recheck password`)
      .required(`required`),
    firstName: Yup.string().required(`required`),
    middleName: Yup.string().notRequired(),
    lastName: Yup.string().required(`required`),
    dob: Yup.date().notRequired(),
    phone: Yup.string().test(
      'is-mobile-phone',
      'invalid mobile phone number',
      phone => isMobilePhone(phone)
    ),
    guardian: Yup.object({
      firstName: Yup.string().required(`required`),
      middleName: Yup.string().notRequired(),
      lastName: Yup.string().required(`required`),
      email: Yup.string()
        .email()
        .required(`required`),
      phone: Yup.string().test(
        'is-mobile-phone',
        'invalid mobile phone number',
        phone => isMobilePhone(phone)
      )
    })
  })
}

const initialValues = {
  email: '',
  password: '',
  passwordConfirmation: '',
  firstName: '',
  middleName: '',
  lastName: '',
  dob: '',
  phone: '',
  guardian: {
    firstName: '',
    middleName: '',
    lastName: '',
    email: '',
    phone: ''
  }
}

function RegisterForm({ onSuccess }) {
  const validationSchema = useMemo(() => getValidationSchema(), [])

  const onSubmit = useCallback(
    async (values, actions) => {
      actions.setStatus(null)

      const { data, error } = await api('/users/register', {
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
            <FormGroup widths="equal">
              <Input name="firstName" label={`First Name`} icon="user" />
              <Input name="middleName" label={`Middle Name`} icon="user" />
              <Input name="lastName" label={`Last Name`} icon="user" />
            </FormGroup>

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

            <Segment basic secondary>
              <Header>Guardian's Information</Header>

              <FormGroup widths="equal">
                <Input
                  name="guardian.firstName"
                  label={`First Name`}
                  icon="user"
                />
                <Input
                  name="guardian.middleName"
                  label={`Middle Name`}
                  icon="user"
                />
                <Input
                  name="guardian.lastName"
                  label={`Last Name`}
                  icon="user"
                />
              </FormGroup>

              <FormGroup widths="equal">
                <Input
                  name="guardian.email"
                  type="email"
                  label={`Email`}
                  icon="envelope"
                />

                <Input
                  name="guardian.phone"
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
