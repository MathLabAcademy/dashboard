import { Link } from '@reach/router'
import HeaderGrid from 'components/HeaderGrid'
import { capitalize, get } from 'lodash-es'
import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { Button, Header, Label, Segment } from 'semantic-ui-react'
import { getUser } from 'store/actions/users'

const labeledRoles = ['teacher']

function UserListItem({ id, data, getData }) {
  useEffect(() => {
    if (!data) getData(id)
  }, [data, getData, id])

  return (
    <Segment loading={!data}>
      <HeaderGrid
        Left={
          <>
            <Header>
              {get(data, 'Person.fullName')}
              {labeledRoles.includes(get(data, 'roleId')) && (
                <Label color="black" size="tiny">
                  {capitalize(get(data, 'roleId'))}
                </Label>
              )}

              <Header.Subheader>{get(data, 'Person.email')}</Header.Subheader>
            </Header>
          </>
        }
        Right={
          <>
            <Button as={Link} to={`${id}`}>
              Open
            </Button>
          </>
        }
      />
    </Segment>
  )
}

const mapStateToProps = ({ users }, { id }) => ({
  data: get(users.byId, id)
})

const mapDispatchToProps = {
  getData: getUser
}

export default connect(mapStateToProps, mapDispatchToProps)(UserListItem)
