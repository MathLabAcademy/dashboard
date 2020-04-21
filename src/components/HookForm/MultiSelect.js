import { FormControl, FormLabel } from '@chakra-ui/core'
import ErrorMessage from './ErrorMessage'
import { get } from 'lodash-es'
import React, { useCallback, useMemo } from 'react'
import { useFormContext } from 'react-hook-form'
import ReactSelect from 'react-select'

export function SelectField({
  id,
  name,
  options,
  isLoading,
  value,
  setValue,
  register,
  ...props
}) {
  const formattedOptions = useMemo(() => {
    return Object.entries(options).reduce((options, [value, label]) => {
      return options.concat({ value, label })
    }, [])
  }, [options])

  const formattedValue = useMemo(() => {
    return value.map((id) => ({ value: id, label: options[id] }))
  }, [value, options])

  const onChange = useCallback(
    (valueOptions) => {
      const value = (valueOptions || []).map(({ value }) => value)
      setValue(name, value)
    },
    [name, setValue]
  )

  return (
    <ReactSelect
      {...props}
      id={id}
      name={name}
      value={formattedValue}
      options={formattedOptions}
      onChange={onChange}
      ref={register}
    />
  )
}

export function FormMultiSelect({
  name,
  id = name,
  label,
  options,
  loading,
  required,
  validate,
  ...props
}) {
  const { register, errors, watch, setValue } = useFormContext()

  const value = watch(name)

  return (
    <FormControl
      isRequired={props.required}
      isDisabled={props.disabled}
      isInvalid={Boolean(get(errors, name))}
      isReadOnly={props.readonly}
    >
      <FormLabel
        htmlFor={id}
        {...(props.labelProps && { ...props.labelProps })}
      >
        {label}
      </FormLabel>

      <SelectField
        {...props}
        id={id}
        name={name}
        options={options}
        isLoading={loading}
        value={value}
        setValue={setValue}
        register={() => register({ name, required, validate })}
        isMulti
      />

      <ErrorMessage name={name} />
    </FormControl>
  )
}
