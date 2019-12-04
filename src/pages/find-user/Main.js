import Form from 'components/Form/Form'
import FormInput from 'components/Form/Input'
import Permit from 'components/Permit'
import { Formik } from 'formik'
import React, { useCallback, useMemo, useState } from 'react'
import { connect } from 'react-redux'
import { Box, Flex } from 'rebass'
import { Button, Message, Segment } from 'semantic-ui-react'
import { findUser } from 'store/actions/users'
import * as Yup from 'yup'
import View from './View'

const getValidationSchema = () => {
  return Yup.object({
    userId: Yup.string().min(5),
    phone: Yup.string().matches(/^01\d{9}$/),
    batchClassEnrollmentId: Yup.string()
      .max(7)
      .min(7),
    batchCourseEnrollmentId: Yup.string()
      .min(7)
      .max(9)
  })
}

const getInitialValues = () => ({
  userId: '',
  phone: '',
  batchClassEnrollmentId: '',
  batchCourseEnrollmentId: ''
})

function FindUser({ findUser }) {
  const [userId, setUserId] = useState()

  const validationSchema = useMemo(() => getValidationSchema(), [])
  const initialValues = useMemo(() => getInitialValues(), [])

  const onSubmit = useCallback(
    async (values, actions) => {
      if (!Object.values(values).some(Boolean)) {
        actions.resetForm()
        return
      }

      actions.setStatus(null)

      try {
        const user = await findUser(values)
        actions.resetForm()
        setUserId(user.id)
      } catch (err) {
        actions.resetForm()
        actions.setStatus(err.message)
        setUserId(null)
      }
    },
    [findUser]
  )

  return (
    <Permit teacher>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        enableReinitialize
        onSubmit={onSubmit}
      >
        {({ isSubmitting, status }) => (
          <Form>
            <Segment>
              <Flex
                justifyContent="space-between"
                alignItems="center"
                flexWrap="wrap"
              >
                <FormInput name="userId" label="User Id" />
                <FormInput name="phone" label="Mobile Number" />
                <FormInput
                  name="batchClassEnrollmentId"
                  label="Batch Class Enrollment ID"
                />
                <FormInput
                  name="batchCourseEnrollmentId"
                  label="Batch Course Enrollment ID"
                />

                <Box>
                  <Button
                    type="submit"
                    loading={isSubmitting}
                    disabled={isSubmitting}
                  >
                    Find
                  </Button>
                </Box>
              </Flex>
            </Segment>

            {status ? <Message color="yellow">{status}</Message> : null}
          </Form>
        )}
      </Formik>

      <View userId={userId} />
    </Permit>
  )
}

const mapStateToProps = null

const mapDispatchToProps = {
  findUser
}

export default connect(mapStateToProps, mapDispatchToProps)(FindUser)
