import HeaderGrid from 'components/HeaderGrid'
import SlateEditor, { SlateViewer } from 'components/Slate/index.js'
import { ErrorMessage, Field, getIn } from 'formik'
import useToggle from 'hooks/useToggle.js'
import React, { useRef } from 'react'
import { Button, FormField, Modal, Segment } from 'semantic-ui-react'

function RichTextField({
  field: { name, value },
  form,
  id,
  label,
  hideLabel,
  isStatic,
  disabled
}) {
  const editor = useRef(null)

  const [open, handle] = useToggle(false)

  return (
    <FormField
      disabled={disabled}
      error={Boolean(getIn(form.errors, name))}
      className={isStatic ? 'static' : ''}
    >
      <HeaderGrid
        Left={
          <label htmlFor={id} className={hideLabel ? 'sr-only' : ''}>
            <strong>{label}</strong>
          </label>
        }
        Right={
          <Button
            type="button"
            icon="edit"
            disabled={disabled}
            onClick={handle.open}
          />
        }
      />

      <Segment>
        <SlateViewer id={id} initialValue={value} />
      </Segment>

      <Modal open={open} onClose={handle.close} closeOnEscape={false}>
        <Modal.Content>
          <SlateEditor ref={editor} initialValue={value} />
        </Modal.Content>
        <Modal.Actions>
          <Button
            type="button"
            color="blue"
            onClick={() => {
              form.setFieldValue(
                name,
                JSON.stringify(editor.current.value.toJSON())
              )
              handle.close()
            }}
          >
            Done
          </Button>
        </Modal.Actions>
      </Modal>

      <ErrorMessage name={name} component="p" className="red text" />
    </FormField>
  )
}

function FormRichText({
  id,
  name,
  label,
  hideLabel = false,
  static: isStatic = false,
  disabled
}) {
  id = id || name

  return (
    <Field
      name={name}
      id={id}
      label={label}
      hideLabel={hideLabel}
      isStatic={isStatic}
      disabled={disabled}
      component={RichTextField}
    />
  )
}

export default FormRichText
