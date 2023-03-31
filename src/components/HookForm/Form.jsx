import { Stack } from '@chakra-ui/core'
import React from 'react'
import { FormContext } from 'react-hook-form'

export function Form({ onSubmit, form, spacing, Component = Stack, ...props }) {
  return (
    <FormContext {...form}>
      <Component
        as="form"
        spacing={spacing}
        onSubmit={form.handleSubmit(onSubmit)}
        {...props}
      />
    </FormContext>
  )
}
