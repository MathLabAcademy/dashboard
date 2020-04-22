import { Stack, Text } from '@chakra-ui/core'
import { ResponsiveCalendar } from '@nivo/calendar'
import HeaderGrid from 'components/HeaderGrid'
import Permit from 'components/Permit'
import { useStats } from 'hooks/useStats'
import { get } from 'lodash-es'
import React, { useCallback, useRef, useState } from 'react'
import { Box } from 'reflexbox'
import { Button, Card, Header, Image, Input } from 'semantic-ui-react'
import { useCurrentUser } from 'store/currentUser/hooks'
import paymentMethodImage from './payment-method.jpeg'

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
    <Permit roles="teacher">
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

function PaymentMethod() {
  const userData = useCurrentUser()

  return (
    <Box p={4} sx={{ borderWidth: 1, boxShadow: 'md' }}>
      <Stack isInline spacing={16} flexWrap="wrap" alignItems="center">
        <Box minWidth="400px">
          <Image src={paymentMethodImage} />
        </Box>
        <Stack spacing={4}>
          <Box p={2}>
            <Text color="gray.500" fontSize={3} as="p">
              bKash Account Number
            </Text>
            <Text fontWeight="bold" fontSize={6}>
              01316350436
            </Text>
          </Box>
          <Box p={2}>
            <Text color="gray.500" fontSize={3} as="p">
              Nagad Virtual Card Number
            </Text>
            <Text fontWeight="bold" fontSize={6}>
              9856000164774156
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

function DashIndex() {
  return (
    <Box>
      <PaymentMethod />
      <DailyTransactionsForYearStats />
    </Box>
  )
}

export default DashIndex
