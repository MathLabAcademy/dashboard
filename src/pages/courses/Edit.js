import { Link } from '@reach/router'
import Form from 'components/Form/Form.js'
import FormField from 'components/Form/Input.js'
import FormTextArea from 'components/Form/TextArea.js'
import HeaderGrid from 'components/HeaderGrid'
import Permit from 'components/Permit.js'
import { Formik } from 'formik'
import { get } from 'lodash-es'
import React, { useCallback, useEffect, useMemo } from 'react'
import { connect } from 'react-redux'
import { Button, Header, Message, Segment } from 'semantic-ui-react'
import { getCourse, updateCourse } from 'store/actions/courses.js'
import * as Yup from 'yup'

const getInitialValues = data => ({
  name: get(data, 'name') || '',
  description: get(data, 'description') || ''
})

const getValidationSchema = () => {
  return Yup.object({
    name: Yup.string().required(`required`),
    description: Yup.string().required(`required`)
  })
}

function CourseEdit({ courseId, data, getData, updateCourse }) {
  useEffect(() => {
    if (!data) getData(courseId)
  }, [courseId, data, getData])

  const initialValues = useMemo(() => getInitialValues(data), [data])
  const validationSchema = useMemo(() => getValidationSchema(), [])

  const onSubmit = useCallback(
    async (values, actions) => {
      try {
        await updateCourse(courseId, values)
        actions.setStatus(null)
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
    [courseId, updateCourse]
  )

  return (
    <Permit teacher>
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
                Left={<Header as="h2">Edit Course #{get(data, 'id')}:</Header>}
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
                      Save
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

const mapStateToProps = ({ courses }, { courseId }) => ({
  data: get(courses.byId, courseId)
})

const mapDispatchToProps = {
  getData: getCourse,
  updateCourse
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CourseEdit)
