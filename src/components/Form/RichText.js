import HeaderGrid from 'components/HeaderGrid'
import { convertToRaw } from 'draft-js'
import RichEditor from 'draft/index.js'
import { ErrorMessage, Field, getIn } from 'formik'
import React, { useRef, useState } from 'react'
import { Button, FormField, Segment } from 'semantic-ui-react'

function RichTextField({
  field: { name, value },
  form,
  id,
  label,
  hideLabel,
  isStatic,
  disabled
}) {
  const storeRef = useRef()

  const [editing, setEditing] = useState(false)

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
          <>
            {editing && (
              <Button
                type="button"
                icon="close"
                onClick={() => setEditing(false)}
              />
            )}

            <Button
              type="button"
              icon={editing ? 'check' : 'edit'}
              disabled={disabled}
              onClick={() => {
                if (!storeRef.current) return

                if (editing) {
                  const editorState = storeRef.current().getEditorState()
                  const contentState = editorState.getCurrentContent()
                  const newValue = contentState.hasText()
                    ? JSON.stringify(convertToRaw(contentState))
                    : ''
                  form.setFieldValue(name, newValue)
                  setEditing(false)
                } else {
                  setEditing(true)
                }
              }}
            />
          </>
        }
      />

      <Segment>
        <RichEditor rawState={value} readOnly={!editing} storeRef={storeRef} />
      </Segment>

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
