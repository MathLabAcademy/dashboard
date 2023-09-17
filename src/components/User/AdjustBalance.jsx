import { Heading, Text } from '@chakra-ui/core'
import { Link } from 'react-router-dom'
import Form from 'components/Form/Form'
import FormInput from 'components/Form/Input'
import HeaderGrid from 'components/HeaderGrid'
import Permit from 'components/Permit'
import { Formik } from 'formik'
import { get } from 'lodash-es'
import React, { useCallback, useEffect, useMemo } from 'react'
import { connect, useDispatch } from 'react-redux'
import { Button, Message, Segment } from 'semantic-ui-react'
import { adjustBalance, readBalance } from 'store/actions/users'
import { trackEventAnalytics } from 'utils/analytics'
import * as Yup from 'yup'

const getValidationSchema = () => {
  return Yup.object({
    amount: Yup.number().integer().required(`required`),
    note: Yup.string().required(`required`),
  })
}

const getInitialValues = (user) => ({
  balance: get(user, 'balance') / 100,
  amount: 0,
  note: '',
})

function UserAdjustBalance({ userId, user, navigate }) {
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(readBalance(userId))
  }, [dispatch, userId])

  const validationSchema = useMemo(() => getValidationSchema(), [])
  const initialValues = useMemo(() => getInitialValues(user), [user])

  const onSubmit = useCallback(
    async ({ amount, note }, actions) => {
      actions.setStatus(null)

      try {
        await dispatch(
          adjustBalance(userId, {
            amount: amount * 100,
            note,
          })
        )

        trackEventAnalytics({
          category: 'Teacher',
          action: 'Adjusted Account Balance',
        })

        navigate('..')
      } catch (err) {
        if (err.errors) {
          err.errors.forEach(({ location, message }) =>
            actions.setFieldError(location, message)
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
    [dispatch, navigate, userId]
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
                Left={
                  <>
                    <Heading size="lg" mb={2}>
                      Adjust Account Balance
                    </Heading>
                    <Text>
                      Adjust account balance here if you previously recorded
                      incorrect transactions
                    </Text>
                  </>
                }
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
                      Adjust
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
                name="balance"
                label={`Current Balance`}
                disabled
                static
              />

              <FormInput
                type="number"
                step="100"
                name="amount"
                label={`Amount to Adjust (can be positive/negative amount)`}
              />

              <FormInput name="note" label={`Note`} />

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

export default connect(mapStateToProps)(UserAdjustBalance)
