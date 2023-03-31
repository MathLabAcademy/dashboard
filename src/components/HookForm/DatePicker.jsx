import { FormControl, FormLabel, Input, Stack } from '@chakra-ui/core'
import { get } from 'lodash-es'
import React, { useCallback, useEffect } from 'react'
import ReactDatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { useFormContext } from 'react-hook-form'
import { toDate } from 'utils/cast'
import ErrorMessage from './ErrorMessage'

export function DatePicker({
  name,
  id = name,
  required = false,
  validate,
  inputProps,
  ...props
}) {
  const { register, unregister, setValue, watch } = useFormContext()

  useEffect(() => {
    register({ name, required, validate })
    return () => unregister(name)
  }, [register, unregister, name, required, validate])

  const selected = toDate(watch(name))

  const onChange = useCallback(
    (value) => {
      setValue(name, value || null)
    },
    [setValue, name]
  )

  return (
    <ReactDatePicker
      {...props}
      selected={selected}
      onChange={onChange}
      customInput={<Input {...inputProps} id={id} name={name} />}
    />
  )
}

export function FormDatePicker({ name, id = name, label, ...props }) {
  const { errors } = useFormContext()

  return (
    <FormControl
      id={id}
      isRequired={props.required}
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

      <Stack isInline>
        <DatePicker {...props} name={name} />
      </Stack>

      <ErrorMessage name={name} />
    </FormControl>
  )
}

export function FormDateRangePicker({
  name,
  id = name,
  label,
  startProps,
  endProps,
  ...props
}) {
  const { errors } = useFormContext()

  return (
    <FormControl
      id={id}
      isRequired={props.required}
      isDisabled={props.disabled}
      isInvalid={Boolean(get(errors, name))}
      isReadOnly={props.readonly}
    >
      <FormLabel htmlFor={id} display={label ? 'block' : 'none'}>
        {label}
      </FormLabel>

      <Stack isInline>
        <DatePicker {...props} {...startProps} name={`${name}.start`} />
        <DatePicker {...props} {...endProps} name={`${name}.end`} />
      </Stack>
    </FormControl>
  )
}
