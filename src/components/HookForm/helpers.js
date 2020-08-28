export function handleAPIError(error, { form, toast }) {
  if (!error) {
    return
  }

  if (error.errors && form) {
    error.errors.forEach(({ location, message }) => {
      form.setError(location, 'FORM', message)
    })
  }

  if (error.message && toast) {
    let description

    if (!form && error.errors) {
      description = error.errors
        .map(({ location, message }) => `${location}: ${message}`)
        .join('\n')
    }

    toast({
      title: error.message,
      description,
      status: 'error',
      duration: 3000,
      isClosable: true,
    })
  }
}
