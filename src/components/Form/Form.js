import { connect } from 'formik'
import React from 'react'
import { Form as SemanticForm } from 'semantic-ui-react'

const Form = connect(({ formik: { handleReset, handleSubmit }, ...props }) => (
  <SemanticForm onReset={handleReset} onSubmit={handleSubmit} {...props} />
))

export default Form
