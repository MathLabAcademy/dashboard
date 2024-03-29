import { FormControl, FormLabel, Input, InputGroup } from '@chakra-ui/core'
import { get } from 'lodash-es'
import React from 'react'
import { useFormContext } from 'react-hook-form'
import ErrorMessage from './ErrorMessage'

export const FormInput = ({
  name,
  id = name,
  type = 'text',
  placeholder,
  required = false,
  validate,
  label,
  labelProps,
  InputLeft = null,
  InputRight = null,
  ...props
}) => {
  const { register, errors } = useFormContext()
  const hasExtras = Boolean(InputLeft || InputRight)

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
        {...labelProps}
      >
        {label}
      </FormLabel>

      {hasExtras ? (
        <InputGroup>
          {InputLeft}
          <Input
            id={id}
            name={name}
            type={type}
            placeholder={placeholder}
            required={required}
            {...props}
            ref={register({ required, validate })}
          />
          {InputRight}
        </InputGroup>
      ) : (
        <Input
          id={id}
          name={name}
          type={type}
          placeholder={placeholder}
          required={required}
          {...props}
          ref={register({ required, validate })}
        />
      )}

      <ErrorMessage name={name} />
    </FormControl>
  )
}
