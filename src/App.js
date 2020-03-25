import { useDisclosure } from '@chakra-ui/core'
import { Router } from '@reach/router'
import Sidebar from 'components/Sidebar'
import Topbar from 'components/Topbar'
import EmailVerification from 'pages/email-verification/Main'
import ForgotPassword from 'pages/forgot-password/Main'
import LogIn from 'pages/login/Main'
import Dashboard from 'pages/Main'
import Register from 'pages/register/Main'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Box, Flex } from 'reflexbox'
import { checkAuthStatus } from 'store/currentUser'

function App() {
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(checkAuthStatus())
  }, [dispatch])

  const userStatus = useSelector((state) => state.user.status)

  const { isOpen, onToggle, onClose } = useDisclosure(true)

  return (
    <>
      <Topbar />

      <Flex height="100vh" sx={{ position: 'relative' }}>
        {userStatus.authed && (
          <Sidebar isOpen={isOpen} onToggle={onToggle} onClose={onClose} />
        )}

        <Box
          flexGrow="1"
          overflowY="scroll"
          width="auto"
          p={10}
          sx={{
            transition: '0.2s',
            height: ({ sizes }) => `calc(100% - ${sizes.navbar})`,
            ml: ({ sizes }) => (isOpen ? sizes.sidebar : '1rem'),
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
