import { Link } from '@reach/router'
import Form from 'components/Form/Form'
import FormInput from 'components/Form/Input'
import FormRichText from 'components/Form/RichText'
import FormSelect from 'components/Form/Select'
import HeaderGrid from 'components/HeaderGrid'
import Permit from 'components/Permit'
import { Formik } from 'formik'
import { get, zipObject } from 'lodash-es'
import React, { useCallback, useMemo } from 'react'
import { connect } from 'react-redux'
import { Button, Header, Message, Segment } from 'semantic-ui-react'
import { createCourse } from 'store/courses'
import { trackEventAnalytics } from 'utils/analytics'
import * as Yup from 'yup'

const getInitialValues = () => ({
  name: '',
  description: '',
  price: 0,
  tagIds: [],
})

const getValidationSchema = () => {
  return Yup.object({
    name: Yup.string().required(`required`),
    description: Yup.string().required(`required`),
    price: Yup.number().integer().required(`required`),
    tagIds: Yup.array().of(Yup.number().integer()),
  })
}

function CourseCreate({ createCourse, courseTags, navigate }) {
  const tagOptions = useMemo(() => {
    return zipObject(
      courseTags.allIds,
      courseTags.allIds.map((id) => get(courseTags.byId, [id, 'name']))
    )
  }, [courseTags.allIds, courseTags.byId])

  const initialValues = useMemo(() => getInitialValues(), [])
  const validationSchema = useMemo(() => getValidationSchema(), [])

  const onSubmit = useCallback(
    async ({ price, ...values }, actions) => {
      actions.setStatus(null)

      try {
        await createCourse({
          price: price * 100,
          ...values,
        })
        trackEventAnalytics({
          category: 'Teacher',
          action: 'Created Course',
        })
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
          console.error(err)
          actions.setStatus(null)
        }
      }

      actions.setSubmitting(false)
    },
    [createCourse, navigate]
  )

  return (
    <Permit roles="teacher,assistant">
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {({ isSubmitting, isValid, status }) => (
          <Form>
            <Segment>
              <HeaderGrid
                Left={<Header as="h2">New Online Course:</Header>}
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

const mapStateToProps = ({ courseTags }) => ({
  courseTags,
})

const mapDispatchToProps = {
  createCourse,
}

export default connect(mapStateToProps, mapDispatchToProps)(CourseCreate)
