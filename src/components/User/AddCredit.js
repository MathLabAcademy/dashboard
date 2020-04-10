import { Link } from '@reach/router'
import Form from 'components/Form/Form'
import FormInput from 'components/Form/Input'
import FormSelect from 'components/Form/Select'
import HeaderGrid from 'components/HeaderGrid'
import Permit from 'components/Permit'
import { Formik } from 'formik'
import { get } from 'lodash-es'
import React, { useCallback, useEffect, useMemo } from 'react'
import { connect } from 'react-redux'
import { Button, Header, Message, Segment } from 'semantic-ui-react'
import { addCredit, readCredit } from 'store/actions/users'
import * as Yup from 'yup'

const getValidationSchema = () => {
  return Yup.object({
    amount: Yup.number().integer().required(`required`),
    transactionTypeId: Yup.string().oneOf(['CASH', 'BKASH']),
  })
}

const getInitialValues = (user) => ({
  credit: get(user, 'credit') / 100,
  amount: 0,
  transactionTypeId: '',
})

const transactionTypeOptions = {
  CASH: 'Cash',
  BKASH: 'bKash',
}

function UserAddCredit({ userId, user, addCredit, readCredit, navigate }) {
  useEffect(() => {
    readCredit(userId)
  }, [readCredit, userId])

  const validationSchema = useMemo(() => getValidationSchema(), [])
  const initialValues = useMemo(() => getInitialValues(user), [user])

  const onSubmit = useCallback(
    async ({ amount, transactionTypeId }, actions) => {
      actions.setStatus(null)

      try {
        await addCredit(userId, {
          amount: amount * 100,
          transactionTypeId,
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
    <Permit roles="teacher">
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

              <FormSelect
                name="transactionTypeId"
                label={`Type`}
                options={transactionTypeOptions}
              />

              <Message compact color="red" as={'strong'}>
                Be sure, this can not be undone!
              </Message>
            </Segment>
          </Form>
        )}
      </Formik>
    </Permit>
  )
}

const mapStateToProps = ({ users }, { userId }) => ({
  user: get(users.byId, userId),
})

const mapDispatchToProps = {
  addCredit,
  readCredit,
}

export default connect(mapStateToProps, mapDispatchToProps)(UserAddCredit)
