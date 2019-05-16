import { Link } from '@reach/router'
import Form from 'components/Form/Form.js'
import FormInput from 'components/Form/Input.js'
import Gravatar from 'components/Gravatar.js'
import HeaderGrid from 'components/HeaderGrid.js'
import Permit from 'components/Permit'
import { Formik } from 'formik'
import { capitalize, get } from 'lodash-es'
import React, { useCallback, useEffect, useMemo } from 'react'
import { connect } from 'react-redux'
import { Button, Header, Label, Message, Segment } from 'semantic-ui-react'
import { addCredit, getUser } from 'store/actions/users.js'
import getPersonName from 'utils/get-person-name.js'
import * as Yup from 'yup'

const labeledRoles = ['admin', 'teacher']

const getValidationSchema = () => {
  return Yup.object({
    amount: Yup.number()
      .integer()
      .required(`required`),
    note: Yup.string().max(255, `too long`)
  })
}

const getInitialValues = data => ({
  credit: get(data, 'credit') / 100,
  amount: 0,
  note: ''
})

function UserAddCredit({ userId, data, getData, addCredit, navigate }) {
  useEffect(() => {
    if (!data) getData(userId)
  }, [data, getData, userId])

  const validationSchema = useMemo(() => getValidationSchema(), [])
  const initialValues = useMemo(() => getInitialValues(data), [data])

  const onSubmit = useCallback(
    async ({ amount, ...values }, actions) => {
      actions.setStatus(null)

      try {
        await addCredit(userId, {
          amount: amount * 100,
          ...values
        })
        navigate('..')
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
    [addCredit, navigate, userId]
  )

  return (
    <Permit teacher>
      <Segment loading={!data}>
        <HeaderGrid
          leftClassName="auto wide"
          Left={
            <Gravatar
              email={get(data, 'Person.email')}
              params={{ d: 'robohash' }}
            />
          }
          rightClassName="grow wide"
          Right={
            <>
              <Header>
                {getPersonName(get(data, 'Person'))}
                <Header.Subheader>{get(data, 'email')}</Header.Subheader>
              </Header>
            </>
          }
        />

        {labeledRoles.includes(get(data, 'roleId')) && (
          <Label color="black" size="tiny" attached="bottom right">
            {capitalize(get(data, 'roleId'))}
          </Label>
        )}
      </Segment>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        enableReinitialize
        onSubmit={onSubmit}
      >
        {({ isSubmitting, isValid, status }) => (
          <Form>
            <Segment>
              <HeaderGrid
                Left={<Header>Add Credit</Header>}
                Right={
                  <>
                    <Button as={Link} to="..">
                      Cancel
                    </Button>
                    <Button type="reset">Reset</Button>
                    <Button
                      positive
                      type="submit"
                      loading={isSubmitting}
                      disabled={!isValid || isSubmitting}
                    >
                      Add
                    </Button>
                  </>
                }
              />
            </Segment>

            <Segment>
              <Message color="yellow" hidden={!status}>
                {status}
              </Message>

              <FormInput
                name="credit"
                label={`Current Credit`}
                disabled
                static
              />

              <FormInput
                type="number"
                step="100"
                name="amount"
                label={`Amount to Add`}
              />

              <FormInput name="note" label={`Note`} />
            </Segment>
          </Form>
        )}
      </Formik>
    </Permit>
  )
}

const mapStateToProps = ({ users }, { userId }) => ({
  data: get(users.byId, userId)
})

const mapDispatchToProps = {
  getData: getUser,
  addCredit
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UserAddCredit)
