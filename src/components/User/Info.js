import { Box, Heading, Text, Stack } from '@chakra-ui/core'
import Permit from 'components/Permit'
import ContactInfo from 'components/User/ContactInfo'
import PersonInfo from 'components/User/PersonInfo'
import TransactionInfo from 'components/User/TransactionInfo'
import { get } from 'lodash-es'
import React, { useMemo } from 'react'
import { connect } from 'react-redux'
import { useCurrentUserData } from 'store/currentUser/hooks'
import EnrollmentInfo from './EnrollmentInfo'
import FacebookAccount from './FacebookAccount'

function UserInfo({ userId, user, refreshUser }) {
  const isStudent = useMemo(() => /^student/.test(get(user, 'roleId')), [user])
  const hasGuardian = useMemo(() => get(user, 'Person.Guardian'), [user])

  return (
    <>
      <PersonInfo
        userId={userId}
        person={get(user, 'Person')}
        title={`Personal Information`}
      />

      <Stack
        isInline
        flexWrap="wrap"
        justifyContent="space-between"
        alignItems="stretch"
      >
        <Box flexGrow="1">
          <ContactInfo
            userId={userId}
            person={get(user, 'Person')}
            title={`Personal Contact Information`}
            refreshUser={refreshUser}
          />
        </Box>
        <Box flexGrow="1">
          <FacebookAccount userId={userId} />
        </Box>
      </Stack>

      {isStudent ? (
        hasGuardian ? (
          <>
            <PersonInfo
              userId={userId}
              person={get(user, 'Person.Guardian')}
              title={`Guardian Information`}
              isGuardian
            />

            <ContactInfo
              userId={userId}
              person={get(user, 'Person.Guardian')}
              title={`Guardian Contact Information`}
              isGuardian
              refreshUser={refreshUser}
            />
          </>
        ) : (
          <PersonInfo
            userId={userId}
            person={get(user, 'Person.Guardian')}
            title={`Guardian Information`}
            isGuardian
          />
        )
      ) : null}

      <EnrollmentInfo userId={userId} title={`Enrollments`} />

      <TransactionInfo userId={get(user, 'id')} title={`Transaction Info`} />
    </>
  )
}

const mapStateToProps = ({ users }, { userId }) => ({
  user: get(users.byId, userId),
})

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(UserInfo)
