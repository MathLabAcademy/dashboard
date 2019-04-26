import './Main.css'

import React from 'react'

import { connect } from 'react-redux'
import { logOut } from 'store/actions/currentUser.js'

import get from 'lodash/get'

import { Match, Link } from '@reach/router'

import { Button, Menu } from 'semantic-ui-react'

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

export default connect(
  mapStateToProps,
  mapActionToProps
)(Navbar)
