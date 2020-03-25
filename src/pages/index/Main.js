import { Stack, Text } from '@chakra-ui/core'
import { ResponsiveCalendar } from '@nivo/calendar'
import HeaderGrid from 'components/HeaderGrid'
import Permit from 'components/Permit'
import { useStats } from 'hooks/useStats'
import { get } from 'lodash-es'
import React, { useCallback, useRef, useState } from 'react'
import { connect } from 'react-redux'
import { Box } from 'reflexbox'
import { Button, Card, Header, Image, Input } from 'semantic-ui-react'
import bkashPaymentTempImage from './bkash-payment-temp.jpeg'

function DailyTransactionsForYearStats() {
  const yearRef = useRef()

  const [year, setYear] = useState(new Date().getFullYear())

  const handleYearChange = useCallback(() => {
    if (!yearRef.current) return
    const year = yearRef.current.inputRef.current.value
    setYear(Number(year))
  }, [])

  const [data = [], loading] = useStats('daily-transactions-for-year', { year })

  return (
    <Permit teacher>
      <Card fluid>
        <Card.Content>
          <Card.Header>
            <HeaderGrid
              Left={<Header>Transaction Stats for {year}</Header>}
              Right={
                <Input
                  ref={yearRef}
                  defaultValue={year}
                  type="number"
                  min="2000"
                  max="2099"
                  step="1"
                  icon="calendar alternate"
                  iconPosition="left"
                  action={
                    <Button
                      loading={loading}
                      type="button"
                      icon="refresh"
                      onClick={handleYearChange}
                    />
                  }
                />
              }
            />
          </Card.Header>
          <Card.Description>
            <Box height={200}>
              <ResponsiveCalendar
                data={data}
                from={`${year}-01-01`}
                to={`${year}-12-31`}
                emptyColor="#eee"
                margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                monthBorderColor="#fff"
                dayBorderWidth={2}
                dayBorderColor="#fff"
              />
            </Box>
          </Card.Description>
        </Card.Content>
      </Card>
    </Permit>
  )
}

function BkashPaymentTemp({ userData }) {
  return (
    <Box p={4} sx={{ borderWidth: 1, boxShadow: 'md' }}>
      <HeaderGrid Left={<Header>Payment by bKash</Header>} Right={null} />

      <Stack isInline spacing={12} flexWrap="wrap" alignItems="center">
        <Box minWidth="400px">
          <Image src={bkashPaymentTempImage} />
        </Box>
        <Stack spacing={4}>
          <Box p={2}>
            <Text color="gray.500" fontSize={3} as="p">
              bKash Account Number
            </Text>
            <Text fontWeight="bold" fontSize={6}>
              01913254460
            </Text>
          </Box>
          <Box p={2}>
            <Text color="gray.500" fontSize={3} as="p">
              Student ID (User ID)
            </Text>
            <Text fontWeight="bold" fontSize={6}>
              {get(userData, 'id')}
            </Text>
          </Box>
        </Stack>
      </Stack>
    </Box>
  )
}

function DashIndex({ userData }) {
  return (
    <Box>
      <BkashPaymentTemp userData={userData} />
      <DailyTransactionsForYearStats />
    </Box>
  )
}

const mapStateToProps = ({ user }) => ({
  userData: get(user, 'data'),
})

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(DashIndex)
