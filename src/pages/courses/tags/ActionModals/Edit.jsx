import Form from 'components/Form/Form'
import FormInput from 'components/Form/Input'
import Permit from 'components/Permit'
import { Formik } from 'formik'
import useToggle from 'hooks/useToggle'
import { get } from 'lodash-es'
import React, { useCallback, useMemo } from 'react'
import { connect } from 'react-redux'
import { Button, Message, Modal } from 'semantic-ui-react'
import { updateTag } from 'store/actions/courseTags'
import { trackEventAnalytics } from 'utils/analytics'
import * as Yup from 'yup'

const getValidationSchema = () => {
  return Yup.object({
    name: Yup.string().min(3).required(`required`),
  })
}

const getInitialValues = (tag) => ({
  name: get(tag, 'name') || '',
})

function TagCreateModal({ tagId, tag, updateTag }) {
  const [open, handle] = useToggle(false)

  const initialValues = useMemo(() => getInitialValues(tag), [tag])
  const validationSchema = useMemo(() => getValidationSchema(), [])

  const onSubmit = useCallback(
    async (values, actions) => {
      actions.setStatus(null)

      try {
        await updateTag(tagId, values)
        actions.resetForm()
        trackEventAnalytics({
          category: 'Teacher',
          action: 'Edited CourseTag',
        })
        handle.close()
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
    [handle, tagId, updateTag]
  )

  return (
    <Permit roles="teacher">
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {({ isSubmitting, isValid, values, status }) => (
          <Modal
            trigger={
              <Button
                type="button"
                basic
                color="blue"
                icon="edit outline"
                onClick={handle.open}
              />
            }
            as={Form}
            closeIcon
            open={open}
            onClose={handle.close}
          >
            <Modal.Header>Edit Tag: {get(tag, 'name')}</Modal.Header>

            <Modal.Content>
              <Message color="yellow" hidden={!status}>
                {status}
              </Message>

              <FormInput name="name" label={`Name`} />
            </Modal.Content>

            <Modal.Actions>
              <Button type="reset">Reset</Button>
              <Button
                positive
                type="submit"
                loading={isSubmitting}
                disabled={!isValid || isSubmitting}
              >
                Save
              </Button>
            </Modal.Actions>
          </Modal>
        )}
      </Formik>
    </Permit>
  )
}

const mapStateToProps = null

const mapDispatchToProps = {
  updateTag,
}

export default connect(mapStateToProps, mapDispatchToProps)(TagCreateModal)
