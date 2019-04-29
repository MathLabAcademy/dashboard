import React, { Component } from 'react'

import { connect } from 'react-redux'
import { setErrorBoundaryMessage } from 'store/actions/ui.js'

import { Button, Segment } from 'semantic-ui-react'

import HeaderGrid from './HeaderGrid'

const defaultMessage = `Something went wrong!`

class ErrorBoundary extends Component {
  componentDidCatch(_error, _info) {
    this.props.setErrorBoundaryMessage(defaultMessage)
  }

  tryRemount = () => {
    this.props.setErrorBoundaryMessage(null)
  }

  render() {
    return this.props.message ? (
      <Segment textAlign="center">
        <HeaderGrid
          Left={this.props.message}
          Right={
            <Button type="button" icon="repeat" onClick={this.tryRemount} />
          }
        />
      </Segment>
    ) : (
      this.props.children
    )
  }
}

const mapStateToProps = ({ ui }) => ({
  message: ui.errorBoundaryMessage
})

const mapDispatchToProps = {
  setErrorBoundaryMessage
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ErrorBoundary)
