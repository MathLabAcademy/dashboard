import React, { Component } from 'react'

import { connect } from 'react-redux'
import { setErrorBoundaryRootError } from 'store/actions/errorBoundary'

import { Button, Segment } from 'semantic-ui-react'

import HeaderGrid from './HeaderGrid'

const defaultMessage = `Something went wrong!`

class RootErrorBoundary extends Component {
  componentDidCatch(_error, _info) {
    this.props.setError(defaultMessage)
  }

  tryRemount = () => {
    this.props.setError(null)
  }

  render() {
    return this.props.error ? (
      <Segment textAlign="center">
        <HeaderGrid
          Left={this.props.error}
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

const mapStateToProps = ({ errorBoundary }) => ({
  error: errorBoundary.rootError,
})

const mapDispatchToProps = {
  setError: setErrorBoundaryRootError,
}

export default connect(mapStateToProps, mapDispatchToProps)(RootErrorBoundary)
