import { Router } from '@reach/router'
import Topbar from 'components/Topbar'
import EmailVerification from 'pages/email-verification/Main'
import ForgotPassword from 'pages/forgot-password/Main'
import LogIn from 'pages/login/Main'
import Dashboard from 'pages/Main'
import Register from 'pages/register/Main'
import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { Box, Flex } from 'reflexbox'
import { checkAuthStatus } from 'store/currentUser'

function App() {
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(checkAuthStatus())
  }, [dispatch])

  return (
    <>
      <Topbar />

      <Flex height="100vh" sx={{ position: 'relative' }}>
        <Box
          flexGrow="1"
          overflowY="scroll"
          width="auto"
          sx={{
            height: ({ sizes }) => `calc(100% - ${sizes.navbar})`,
            mt: ({ sizes }) => sizes.navbar,
          }}
        >
          <Router>
            <Dashboard path="/*" />
            <LogIn path="/login" />
            <Register path="/register" />
            <EmailVerification path="/verify-email/:token" />
            <EmailVerification
              path="/verify-guardian-email/:token"
              forGuardian
            />
            <ForgotPassword path="/forgot-password/*" />
          </Router>
        </Box>
      </Flex>
    </>
  )
}

export default App
