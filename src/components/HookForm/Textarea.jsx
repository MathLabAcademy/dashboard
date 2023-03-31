import { FormControl, FormLabel, Textarea } from '@chakra-ui/core'
import ErrorMessage from './ErrorMessage'
import { get } from 'lodash-es'
import React from 'react'
import { useFormContext } from 'react-hook-form'

export const FormTextarea = ({
  name,
  id = name,
  placeholder,
  required = false,
  validate,
  label,
  resize = 'vertical',
  ...props
}) => {
  const { register, errors } = useFormContext()

  return (
    <FormControl
      isRequired={required}
      isDisabled={props.disabled}
      isInvalid={Boolean(get(errors, name))}
      isReadOnly={props.readonly}
    >
      <FormLabel
        htmlFor={id}
        display={label ? 'block' : 'none'}
        {...(props.labelProps && { ...props.labelProps })}
      >
        {label}
      </FormLabel>

      <Textarea
        id={id}
        name={name}
        placeholder={placeholder}
        required={required}
        resize={resize}
        {...props}
        ref={register({ required, validate })}
      />

      <ErrorMessage name={name} />
    </FormControl>
  )
}
