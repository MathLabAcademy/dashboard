import { Link } from 'react-router-dom'
import Form from 'components/Form/Form'
import FormInput from 'components/Form/Input'
import HeaderGrid from 'components/HeaderGrid'
import Permit from 'components/Permit'
import { Formik } from 'formik'
import { get } from 'lodash-es'
import React, { useCallback, useEffect, useMemo } from 'react'
import { connect } from 'react-redux'
import { Button, Header, Message, Segment } from 'semantic-ui-react'
import { getBatchClass, updateBatchClass } from 'store/actions/batches'
import * as Yup from 'yup'

const getValidationSchema = () => {
  return Yup.object({
    name: Yup.string().required(`required`),
  })
}

const getInitialValues = (batchClass) => ({
  name: get(batchClass, 'name', ''),
})

function BatchClassEdit({
  batchClassId,
  batchClass,
  getBatchClass,
  updateBatchClass,
}) {
  useEffect(() => {
    if (!batchClass) getBatchClass(batchClassId)
  }, [batchClass, batchClassId, getBatchClass])

  const initialValues = useMemo(() => getInitialValues(batchClass), [
    batchClass,
  ])
  const validationSchema = useMemo(() => getValidationSchema(), [])

  const onSubmit = useCallback(
    async (values, actions) => {
      actions.setStatus(null)

      try {
        await updateBatchClass(batchClassId, values)
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
    [updateBatchClass, batchClassId]
  )

  return (
    <Permit roles="teacher">
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        enableReinitialize
        onSubmit={onSubmit}
      >
        {({ isSubmitting, isValid, values, status }) => (
          <Form>
            <Segment>
              <HeaderGrid
                Left={
                  <Header>
                    Edit Batch Class: {String(batchClassId).padStart(2, '0')}
                  </Header>
                }
                Right={
                  <>
                    <Button as={Link} to="./..">
                      Go Back
                    </Button>
                    <Button type="reset">Reset</Button>
                    <Button
                      positive
                      type="submit"
                      loading={isSubmitting}
                      disabled={!isValid || isSubmitting}
                    >
                      Save
                    </Button>
                  </>
                }
              />
            </Segment>

            <Segment>
              <Message color="yellow" hidden={!status}>
                {status}
              </Message>

              <FormInput name="name" label={`Name`} />
            </Segment>
          </Form>
        )}
      </Formik>
    </Permit>
  )
}

const mapStateToProps = ({ batches }, { batchClassId }) => ({
  batchClass: get(batches.classes.byId, batchClassId),
})

const mapDispatchToProps = {
  getBatchClass,
  updateBatchClass,
}

export default connect(mapStateToProps, mapDispatchToProps)(BatchClassEdit)
