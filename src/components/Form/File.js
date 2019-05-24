import { ErrorMessage, Field, getIn } from 'formik'
import React from 'react'
import { FormField, Input } from 'semantic-ui-react'

const FormFile = ({
  id,
  name,
  label,
  hideLabel = false,
  validate,
  icon,
  iconPosition = 'left',
  static: isStatic = false,
  ...props
}) => {
  id = id || name

  const iconProps = icon ? { icon, iconPosition } : {}

  return (
    <Field name={name} validate={validate}>
      {({ field: { onChange, value, ...field }, form }) => (
        <FormField
          disabled={props.disabled}
          error={Boolean(getIn(form.errors, name))}
          className={isStatic ? 'static' : ''}
        >
          <label htmlFor={id} className={hideLabel ? 'sr-only' : ''}>
            {label}
          </label>
          <Input
            {...field}
            id={id}
            type="file"
            onChange={e => {
              form.setFieldTouched(name, true)
              form.setFieldValue(
                name,
                props.multiple ? e.target.files : e.target.files[0]
              )
            }}
            {...iconProps}
            {...props}
          />
          <ErrorMessage name={name} component="p" className="red text" />
        </FormField>
      )}
    </Field>
  )
}

export default FormFile
