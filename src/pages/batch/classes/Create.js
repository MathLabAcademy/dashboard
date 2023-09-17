import { Link } from 'react-router-dom'
import Form from 'components/Form/Form'
import FormInput from 'components/Form/Input'
import HeaderGrid from 'components/HeaderGrid'
import Permit from 'components/Permit'
import { Formik } from 'formik'
import React, { useCallback, useMemo } from 'react'
import { connect } from 'react-redux'
import { Button, Header, Message, Segment } from 'semantic-ui-react'
import { createBatchClass } from 'store/actions/batches'
import * as Yup from 'yup'

const getValidationSchema = () => {
  return Yup.object({
    id: Yup.number().integer().min(1).max(99).required(`required`),
    name: Yup.string().required(`required`),
  })
}

const getInitialValues = () => ({
  id: '',
  name: '',
})

function BatchClassCreate({ createBatchClass, navigate }) {
  const initialValues = useMemo(() => getInitialValues(), [])
  const validationSchema = useMemo(() => getValidationSchema(), [])

  const onSubmit = useCallback(
    async (values, actions) => {
      actions.setStatus(null)

      try {
        await createBatchClass(values)
        actions.resetForm()
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
    [createBatchClass, navigate]
  )

  return (
    <Permit roles="teacher">
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {({ isSubmitting, isValid, values, status }) => (
          <Form>
            <Segment>
              <HeaderGrid
                Left={<Header>Create Batch Class</Header>}
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

              <FormInput
                type="number"
                name="id"
                label={`ID`}
                min="1"
                max="99"
                step="1"
              />

              <FormInput name="name" label={`Name`} />
            </Segment>
          </Form>
        )}
      </Formik>
    </Permit>
  )
}

const mapStateToProps = null

const mapDispatchToProps = {
  createBatchClass,
}

export default connect(mapStateToProps, mapDispatchToProps)(BatchClassCreate)
