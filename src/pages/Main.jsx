import { useDisclosure } from '@chakra-ui/core'
import { Redirect } from 'components/Redirect'
import Sidebar from 'components/Sidebar'
import React from 'react'
import { useSelector } from 'react-redux'
import { Route, Routes } from 'react-router-dom'
import { Box } from 'reflexbox'
import { usePageviewAnalytics } from 'utils/analytics'
import BatchClasses from './batch/classes/Main'
import BatchCourses from './batch/courses/Main'
import Courses from './courses/Main'
import FindUser from './find-user/Main'
import Index from './index/Main'
import MCQs from './mcqs/Main'
import Notifications from './notifications'
import Profile from './profile/Main'
import SMSPage from './sms'
import Users from './users/Main'

function Dashboard() {
  usePageviewAnalytics()

  const { status: userStatus } = useSelector((state) => state.user)

  const { isOpen, onToggle, onClose } = useDisclosure(true)

  return userStatus.loading ? (
    <div>Loading...</div>
  ) : userStatus.authed ? (
    <Box position="relative">
      {userStatus.authed && (
        <Sidebar isOpen={isOpen} onToggle={onToggle} onClose={onClose} />
      )}

      <Box
        width="auto"
        p={6}
        sx={{
          position: 'fixed',
          top: ({ sizes }) => sizes.navbar,
          bottom: 0,
          right: 0,
          left: 0,
          transition: '0.1s',
          ml: ({ sizes }) => (isOpen ? sizes.sidebar : '1rem'),
          overflowY: 'auto',
        }}
      >
        <Routes>
          <Route element={<Index />} path="/" />
          <Route element={<BatchClasses />} path="batchclasses/*" />
          <Route element={<BatchCourses />} path="batchcourses/*" />
          <Route element={<Courses />} path="courses/*" />
          <Route element={<MCQs />} path="mcqs/*" />
          <Route element={<Profile />} path="profile/*" />
          <Route element={<Users />} path="users/*" />
          <Route element={<FindUser />} path="find-user/*" />
          <Route element={<Notifications />} path="notifications/*" />
          <Route element={<SMSPage />} path="sms/*" />
        </Routes>
      </Box>
    </Box>
  ) : (
    <Redirect to="/login" />
  )
}

export default Dashboard
