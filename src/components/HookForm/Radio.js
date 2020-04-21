import { Radio, FormControl, FormLabel } from '@chakra-ui/core'
import ErrorMessage from './ErrorMessage'
import { get } from 'lodash-es'
import React from 'react'
import { useFormContext } from 'react-hook-form'

export const FormRadio = ({
  name,
  id = name,
  required = false,
  validate,
  label,
  ...props
}) => {
  const { register, errors } = useFormContext()

  return (
    <FormControl
      isRequired={required}
      isDisabled={props.disabled}
      isInvalid={Boolean(get(errors, name))}
      isReadOnly={props.readonly}
      display="inline-flex"
    >
      <Radio
        id={id}
        name={name}
        required={required}
        {...props}
        ref={register({ required, validate })}
      />

      <FormLabel htmlFor={id} display={label ? 'block' : 'none'}>
        {label}
      </FormLabel>

      <ErrorMessage name={name} />
    </FormControl>
  )
}
