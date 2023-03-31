import React from 'react'

import { Button, FormField } from 'semantic-ui-react'

const FormButton = ({ ...props }) => (
  <FormField disabled={props.disabled}>
    <Button {...props} />
  </FormField>
)

export default FormButton
