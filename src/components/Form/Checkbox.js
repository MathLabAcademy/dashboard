import { ErrorMessage, Field, getIn } from 'formik'
import React from 'react'
import { Checkbox, FormField } from 'semantic-ui-react'

const FormCheckbox = ({
  id,
  name,
  type,
  label,
  static: isStatic = false,
  ...props
}) => {
  id = id || name

  return (
    <Field name={name}>
      {({ field: { value, ...field }, form }) => (
        <FormField
          disabled={props.disabled}
          error={Boolean(getIn(form.errors, name))}
          className={isStatic ? 'static' : ''}
        >
          <Checkbox
            {...field}
            id={id}
            type={type}
            checked={value}
            label={<label htmlFor={id}>{label}</label>}
            {...props}
          />
          <ErrorMessage name={name} component="p" className="red text" />
        </FormField>
      )}
    </Field>
  )
}

export default FormCheckbox
