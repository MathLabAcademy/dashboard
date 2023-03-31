import { Button } from '@chakra-ui/core'
import React, { useCallback } from 'react'
import { useFormContext } from 'react-hook-form'

export function FormButton({ type = 'button', ...props }) {
  const { formState } = useFormContext()

  const getFormButtonProps = useCallback(
    (formState) => {
      if (type === 'submit') {
        return {
          isLoading: formState.isSubmitting,
          isDisabled: formState.isSubmitting || !formState.dirty,
        }
      }

      return {}
    },
    [type]
  )

  return <Button type={type} {...getFormButtonProps(formState)} {...props} />
}
