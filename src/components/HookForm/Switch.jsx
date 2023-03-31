import { FormControl, FormLabel, Switch } from '@chakra-ui/core'
import ErrorMessage from './ErrorMessage'
import { get } from 'lodash-es'
import React, { useCallback } from 'react'
import { useFormContext } from 'react-hook-form'

export const FormSwitch = ({
  name,
  id = name,
  required = false,
  validate,
  label,
  onValue = true,
  offValue = false,
  ...props
}) => {
  const { register, errors, setValue, watch } = useFormContext()

  const onChange = useCallback(
    (event) => {
      setValue(name, event.target.checked ? onValue : offValue)
    },
    [name, offValue, onValue, setValue]
  )

  const ref = useCallback(() => {
    register({ name, required, validate })
  }, [name, register, required, validate])

  const value = watch(name)

  return (
    <FormControl
      isRequired={required}
      isDisabled={props.disabled}
      isInvalid={Boolean(get(errors, name))}
      isReadOnly={props.readonly}
    >
      <FormLabel htmlFor={id} display={label ? 'block' : 'none'}>
        {label}
      </FormLabel>

      <Switch
        id={id}
        name={name}
        required={required}
        {...props}
        isChecked={value === onValue}
        ref={ref}
        onChange={onChange}
      />

      <ErrorMessage name={name} />
    </FormControl>
  )
}
