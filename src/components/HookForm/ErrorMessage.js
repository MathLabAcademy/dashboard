import { FormErrorMessage } from '@chakra-ui/core'
import { get } from 'lodash-es'
import React, { useMemo } from 'react'
import { useFormContext } from 'react-hook-form'

export function ErrorMessage({ name, as: Component = FormErrorMessage }) {
  const { errors } = useFormContext()

  const error = useMemo(() => get(errors, name), [errors, name])

  return error ? (
    <Component color="red.500" mb={4}>
      {error.message}
    </Component>
  ) : null
}

export default ErrorMessage
