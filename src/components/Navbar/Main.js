import { Link, Match } from '@reach/router'
import { get } from 'lodash-es'
import React from 'react'
import { connect } from 'react-redux'
import { Button, Menu } from 'semantic-ui-react'
import { logOut } from 'store/actions/currentUser'
import './Main.css'

function Navbar({ userStatus, sidebarVisible, toggleSidebar, logOut }) {
  return (
    <Menu borderless className="mathlab navbar">
      {userStatus.authed ? (
        <Menu.Item className="mobile only">
          <Button
            type="button"
            icon="sidebar"
            active={sidebarVisible}
            onClick={toggleSidebar}
          />
        </Menu.Item>
      ) : null}

      <Menu.Menu position="right">
        {!userStatus.loading && !userStatus.authed ? (
          <Menu.Item>
            <Match path="/login">
              {({ match }) =>
                match ? (
                  <Button as={Link} to="/register">
                    Register
                  </Button>
                ) : (
                  <Button as={Link} to="/login">
                    Log In
                  </Button>
                )
              }
            </Match>
          </Menu.Item>
        ) : null}

        {userStatus.authed ? (
          <Menu.Item>
            <Button onClick={logOut}>Log Out</Button>
          </Menu.Item>
        ) : null}
      </Menu.Menu>
    </Menu>
  )
}

const mapStateToProps = ({ user }) => ({
  userStatus: get(user, 'status')
})

const mapActionToProps = {
  logOut
}

export default connect(mapStateToProps, mapActionToProps)(Navbar)
