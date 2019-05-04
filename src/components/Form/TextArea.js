import { ErrorMessage, Field, getIn } from 'formik'
import React from 'react'
import { FormField, TextArea } from 'semantic-ui-react'

const FormTextArea = ({
  id,
  name,
  label,
  hideLabel = false,
  placeholder,
  validate,
  static: isStatic = false,
  ...props
}) => {
  id = id || name

  return (
    <Field name={name} validate={validate}>
      {({ field, form }) => (
        <FormField
          disabled={props.disabled}
          error={Boolean(getIn(form.errors, name))}
          className={isStatic ? 'static' : ''}
        >
          <label htmlFor={id} className={hideLabel ? 'sr-only' : ''}>
            {label}
          </label>
          <TextArea {...field} id={id} placeholder={placeholder} {...props} />
          <ErrorMessage name={name} component="p" className="red text" />
        </FormField>
      )}
    </Field>
  )
}

export default FormTextArea
