import { Link } from '@reach/router'
import Form from 'components/Form/Form.js'
import FormField from 'components/Form/Input.js'
import FormTextArea from 'components/Form/TextArea.js'
import HeaderGrid from 'components/HeaderGrid'
import Permit from 'components/Permit.js'
import { Formik } from 'formik'
import React, { useCallback, useMemo } from 'react'
import { connect } from 'react-redux'
import { Button, Header, Message, Segment } from 'semantic-ui-react'
import { createCourse } from 'store/actions/courses.js'
import * as Yup from 'yup'

const getInitialValues = () => ({
  name: '',
  description: ''
})

const getValidationSchema = () => {
  return Yup.object({
    name: Yup.string().required(`required`),
    description: Yup.string().required(`required`)
  })
}

function CourseCreate({ createCourse, navigate }) {
  const initialValues = useMemo(() => getInitialValues(), [])
  const validationSchema = useMemo(() => getValidationSchema(), [])

  const onSubmit = useCallback(
    async (values, actions) => {
      try {
        await createCourse(values)
        actions.setStatus(null)
        navigate('/courses')
      } catch (err) {
        if (err.errors) {
          err.errors.forEach(({ param, message }) =>
            actions.setFieldError(param, message)
          )
        } else if (err.message) {
          actions.setStatus(err.message)
        } else {
          console.error(err)
          actions.setStatus(null)
        }
      }

      actions.setSubmitting(false)
    },
    [createCourse, navigate]
  )

  return (
    <Permit teacher>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {({ isSubmitting, isValid, status }) => (
          <Form>
            <Segment>
              <HeaderGrid
                Left={<Header as="h2">New Course:</Header>}
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
                      Create
                    </Button>
                  </>
                }
              />
            </Segment>

            <Segment>
              {status ? <Message color="yellow">{status}</Message> : null}

              <FormField id="name" name="name" label={`Name`} />

              <FormTextArea
                id="description"
                name="description"
                label={`Description`}
              />
            </Segment>
          </Form>
        )}
      </Formik>
    </Permit>
  )
}

const mapStateToProps = null

const mapDispatchToProps = {
  createCourse
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CourseCreate)
