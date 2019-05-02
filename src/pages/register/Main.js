import { Redirect } from '@reach/router'
import { get } from 'lodash-es'
import React, { useCallback, useState } from 'react'
import { connect } from 'react-redux'
import { Grid, Header, Message } from 'semantic-ui-react'
import getPersonName from 'utils/get-person-name.js'
import Form from './Form.js'

function Register({ userStatus }) {
  const [data, setData] = useState(null)

  const onSuccess = useCallback(data => {
    setData(data)
  }, [])

  return userStatus.authed ? (
    <Redirect to="/" noThrow />
  ) : (
    <Grid columns={1} centered padded>
      <Grid.Column mobile={16} tablet={12} style={{ maxWidth: '840px' }}>
        <Header as="h2" textAlign="center">
          Register
        </Header>

        {data ? (
          <Message
            positive
            header={`Hello ${getPersonName(get(data, 'Person'))}!`}
            content={`You are Successfully Registered!`}
          />
        ) : (
          <Form onSuccess={onSuccess} />
        )}
      </Grid.Column>
    </Grid>
  )
}

const mapStateToProps = ({ user }) => ({
  userStatus: get(user, 'status')
})

export default connect(mapStateToProps)(Register)
