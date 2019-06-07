import HeaderGrid from 'components/HeaderGrid'
import RichEditor from 'draft/index.js'
import { ErrorMessage, Field, getIn } from 'formik'
import React, { useEffect, useState } from 'react'
import { Button, FormField, Segment } from 'semantic-ui-react'
import { EditorState, convertToRaw, convertFromRaw } from 'draft-js'

function RichTextField({
  field: { name, value },
  form,
  id,
  label,
  hideLabel,
  isStatic,
  disabled
}) {
  const [editorState, setEditorState] = useState(
    value
      ? EditorState.createWithContent(convertFromRaw(JSON.parse(value)))
      : EditorState.createEmpty()
  )

  useEffect(() => {
    setEditorState(
      value
        ? EditorState.createWithContent(convertFromRaw(JSON.parse(value)))
        : EditorState.createEmpty()
    )
  }, [value])

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
                if (editing) {
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
        <RichEditor
          editorState={editorState}
          setEditorState={setEditorState}
          readOnly={!editing}
        />
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
