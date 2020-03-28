import { Field } from 'formik'
import React from 'react'
import { Checkbox } from 'semantic-ui-react'

const FormExclusiveCheckboxField = ({ name, value, label, ...props }) => {
  const id = `${name}-${value}`
  return (
    <Field name={name}>
      {({
        field: { value: selectedValue },
        form: { setFieldTouched, setFieldValue },
      }) => (
        <Checkbox
          {...props}
          id={id}
          value={value}
          checked={selectedValue === value}
          label={<label htmlFor={id}>{label}</label>}
          onChange={(_, data) => {
            setFieldTouched(name, true)
            setFieldValue(name, data.value)
          }}
        />
      )}
    </Field>
  )
}

export default FormExclusiveCheckboxField
