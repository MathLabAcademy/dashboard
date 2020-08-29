import { Box, FormControl, FormLabel, IconButton, Stack } from '@chakra-ui/core'
import RichEditor from 'components/Draft/index'
import { convertToRaw } from 'draft-js'
import { get } from 'lodash-es'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import ErrorMessage from './ErrorMessage'

export const FormRichText = ({
  name,
  id = name,
  required = false,
  label,
  labelProps,
  disableImage,
  ...props
}) => {
  const storeRef = useRef(null)
  const [editing, setEditing] = useState(false)

  const { register, unregister, errors, watch, setValue } = useFormContext()

  useEffect(() => {
    register({ name, required })
    return () => unregister(name)
  }, [register, name, required, unregister])

  const value = watch(name)

  const onChange = useCallback(() => {
    if (!storeRef.current) return

    if (editing) {
      const editorState = storeRef.current().getEditorState()
      const contentState = editorState.getCurrentContent()
      const newValue = contentState.hasText()
        ? JSON.stringify(convertToRaw(contentState))
        : ''

      setValue(name, newValue)
      setEditing(false)
    } else {
      setEditing(true)
    }
  }, [editing, name, setValue])

  return (
    <FormControl
      isRequired={required}
      isDisabled={props.disabled}
      isInvalid={Boolean(get(errors, name))}
      isReadOnly={props.readonly}
    >
      <Stack isInline justifyContent="space-between" alignItems="center" mb={1}>
        <Box>
          <FormLabel
            htmlFor={id}
            display={label ? 'block' : 'none'}
            {...labelProps}
          >
            {label}
          </FormLabel>
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
            isDisabled={props.disabled}
            variantColor={editing ? 'green' : 'cyan'}
            size="sm"
            onClick={onChange}
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

      <ErrorMessage name={name} />
    </FormControl>
  )
}
