import { useDisclosure } from '@chakra-ui/core'
import { Redirect, Router } from '@reach/router'
import Sidebar from 'components/Sidebar'
import React from 'react'
import { useSelector } from 'react-redux'
import { Box } from 'reflexbox'
import BatchClasses from './batch/classes/Main'
import BatchCourses from './batch/courses/Main'
import Courses from './courses/Main'
import FindUser from './find-user/Main'
import Index from './index/Main'
import MCQs from './mcqs/Main'
import Profile from './profile/Main'
import Users from './users/Main'

function Dashboard() {
  const { status: userStatus } = useSelector((state) => state.user)

  const { isOpen, onToggle, onClose } = useDisclosure(true)

  return userStatus.loading ? (
    <div>Loading...</div>
  ) : userStatus.authed ? (
    <>
      {userStatus.authed && (
        <Sidebar isOpen={isOpen} onToggle={onToggle} onClose={onClose} />
      )}

      <Box
        width="auto"
        p={6}
        sx={{
          transition: '0.1s',
          ml: ({ sizes }) => (isOpen ? sizes.sidebar : '1rem'),
        }}
      >
        <Router>
          <Index path="/" />
          <BatchClasses path="batchclasses/*" />
          <BatchCourses path="batchcourses/*" />
          <Courses path="courses/*" />
          <MCQs path="mcqs/*" />
          <Profile path="profile/*" />
          <Users path="users/*" />
          <FindUser path="find-user/*" />
        </Router>
      </Box>
    </>
  ) : (
    <Redirect to="/login" noThrow />
  )
}

export default Dashboard
