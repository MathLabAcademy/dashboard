import { Link } from '@reach/router'
import Form from 'components/Form/Form'
import FormInput from 'components/Form/Input'
import FormRichText from 'components/Form/RichText'
import FormSelect from 'components/Form/Select'
import HeaderGrid from 'components/HeaderGrid'
import Permit from 'components/Permit'
import { Formik } from 'formik'
import { get, zipObject } from 'lodash-es'
import React, { useCallback, useEffect, useMemo } from 'react'
import { connect } from 'react-redux'
import { Button, Header, Message, Segment } from 'semantic-ui-react'
import { getCourse, updateCourse } from 'store/actions/courses'
import * as Yup from 'yup'

const getInitialValues = course => ({
  name: get(course, 'name') || '',
  description: get(course, 'description') || '',
  price: (get(course, 'price') || 0) / 100,
  tagIds: get(course, 'tagIds').map(String)
})

const getValidationSchema = () => {
  return Yup.object({
    name: Yup.string().required(`required`),
    description: Yup.string().required(`required`),
    price: Yup.number()
      .integer()
      .required(`required`),
    tagIds: Yup.array().of(Yup.number().integer())
  })
}

function CourseEdit({ courseId, course, getCourse, courseTags, updateCourse }) {
  useEffect(() => {
    if (!course) getCourse(courseId)
  }, [courseId, course, getCourse])

  const initialValues = useMemo(() => getInitialValues(course), [course])
  const validationSchema = useMemo(() => getValidationSchema(), [])

  const onSubmit = useCallback(
    async ({ price, ...values }, actions) => {
      actions.setStatus(null)

      try {
        await updateCourse(courseId, {
          price: price * 100,
          ...values
        })
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

  const tagOptions = useMemo(() => {
    return zipObject(
      courseTags.allIds,
      courseTags.allIds.map(id => get(courseTags.byId, [id, 'name']))
    )
  }, [courseTags.allIds, courseTags.byId])

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
                Left={<Header as="h2">Edit Course #{courseId}:</Header>}
                Right={
                  <>
                    <Button as={Link} to="..">
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
              {status ? <Message color="yellow">{status}</Message> : null}

              <FormInput id="name" name="name" label={`Name`} />

              <FormRichText name="description" label={`Description`} />

              <FormInput
                type="number"
                step="100"
                id="price"
                name="price"
                label={`Price (BDT)`}
              />

              <FormSelect
                name="tagIds"
                label={`Tags`}
                options={tagOptions}
                fluid
                multiple
                search
                selection
              />
            </Segment>
          </Form>
        )}
      </Formik>
    </Permit>
  )
}

const mapStateToProps = ({ courses, courseTags }, { courseId }) => ({
  course: get(courses.byId, courseId),
  courseTags
})

const mapDispatchToProps = {
  getCourse,
  updateCourse
}

export default connect(mapStateToProps, mapDispatchToProps)(CourseEdit)
