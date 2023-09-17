import {
  Accordion,
  AccordionHeader,
  AccordionItem,
  AccordionPanel,
  Heading,
} from '@chakra-ui/core'
import { Redirect } from 'components/Redirect'
import { get } from 'lodash-es'
import React from 'react'
import { connect } from 'react-redux'
import { usePageviewAnalytics } from 'utils/analytics'
import EmailLoginForm from './EmailLoginForm'
import PhoneLoginForm from './PhoneLoginForm'

function LogIn({ userStatus }) {
  usePageviewAnalytics()

  return userStatus.authed ? (
    <Redirect to="/" />
  ) : (
    <Accordion maxWidth="512px" mx="auto" px={2} py={8}>
      <AccordionItem>
        <AccordionHeader>
          <Heading flex="1" fontSize={4} textAlign="center" p={2}>
            Login with Email
          </Heading>
        </AccordionHeader>
        <AccordionPanel>
          <EmailLoginForm />
        </AccordionPanel>
      </AccordionItem>

      <AccordionItem>
        <AccordionHeader>
          <Heading flex="1" fontSize={4} textAlign="center" p={2}>
            Login with Phone
          </Heading>
        </AccordionHeader>
        <AccordionPanel>
          <PhoneLoginForm />
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  )
}

const mapStateToProps = ({ user }) => ({
  userStatus: get(user, 'status'),
})

export default connect(mapStateToProps)(LogIn)
