import { Box, IconButton, Stack } from '@chakra-ui/core'
import RichEditor from 'components/Draft/index'
import { convertToRaw } from 'draft-js'
import { ErrorMessage, Field, getIn } from 'formik'
import React, { useRef, useState } from 'react'
import { FormField } from 'semantic-ui-react'

function RichTextField({
  field: { name, value },
  form,
  id,
  label,
  hideLabel,
  isStatic,
  disabled,
  disableImage,
}) {
  const storeRef = useRef(null)

  const [editing, setEditing] = useState(false)

  return (
    <FormField
      disabled={disabled}
      error={Boolean(getIn(form.errors, name))}
      className={isStatic ? 'static' : ''}
    >
      <Stack isInline justifyContent="space-between" alignItems="center" mb={1}>
        <Box>
          <label htmlFor={id} className={hideLabel ? 'sr-only' : ''}>
            <strong>{label}</strong>
          </label>
        </Box>
        <Stack isInline spacing={2}>
          {editing && (
            <IconButton
              type="button"
              icon="close"
              variantColor="red"
              size="sm"
              onClick={() => setEditing(false)}
            />
          )}

          <IconButton
            type="button"
            icon={editing ? 'check' : 'edit'}
            isDisabled={disabled}
            variantColor={editing ? 'green' : 'cyan'}
            size="sm"
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
        </Stack>
      </Stack>

      <Box borderWidth="1px" p={2} bg="white">
        <RichEditor
          rawState={value}
          readOnly={!editing}
          storeRef={storeRef}
          disableImage={disableImage}
        />
      </Box>

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
  disabled,
  disableImage,
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
      disableImage={disableImage}
      component={RichTextField}
    />
  )
}

export default FormRichText
