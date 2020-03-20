import React, { useCallback, useMemo } from 'react'

import { Field, ErrorMessage } from 'formik'

import { FormField, Dropdown } from 'semantic-ui-react'

import formatDropdownOptions from 'utils/format-dropdown-options'

function SelectionDropdown({
  field: { name, value },
  form: { setFieldTouched, setFieldValue },
  id,
  options,
  ...props
}) {
  const formattedOptions = useMemo(() => {
    return formatDropdownOptions(options)
  }, [options])

  const onChange = useCallback(
    (_, { value }) => {
      setFieldTouched(name, true)
      setFieldValue(name, value)
    },
    [name, setFieldTouched, setFieldValue]
  )

  const onBlur = useCallback(() => {
    setFieldTouched(name, true)
  }, [name, setFieldTouched])

  return (
    <Dropdown
      {...props}
      selection
      id={id}
      name={name}
      value={value}
      options={formattedOptions}
      onBlur={onBlur}
      onChange={onChange}
    />
  )
}

function FormSelect({ id, name, label, hideLabel = false, options, ...props }) {
  return (
    <FormField>
      <label htmlFor={id} className={hideLabel ? 'sr-only' : ''}>
        {label}
      </label>
      <Field
        name={name}
        id={id}
        options={options}
        {...props}
        component={SelectionDropdown}
      />
      <ErrorMessage name={name} component="p" className="red text" />
    </FormField>
  )
}

export default FormSelect
