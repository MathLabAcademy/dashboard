import {
  Box,
  Heading,
  IconButton,
  Image,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Stack,
  Text,
} from '@chakra-ui/core'
import { ResponsiveCalendar } from '@nivo/calendar'
import Permit from 'components/Permit'
import { useStats } from 'hooks/useStats'
import { get } from 'lodash-es'
import { FaCalendarAlt, FaSyncAlt } from 'react-icons/fa'
import React, { useCallback, useRef, useState } from 'react'
import { useCurrentUserData } from 'store/currentUser/hooks'
import paymentMethodImage from './payment-method.jpeg'

function DailyTransactionsForYearStats({ ...props }) {
  const yearRef = useRef()

  const [year, setYear] = useState(new Date().getFullYear())

  const handleYearChange = useCallback(() => {
    if (!yearRef.current) return
    const year = yearRef.current.value
    setYear(Number(year))
  }, [])

  const { data = [], loading } = useStats('daily-transactions-for-year', {
    year,
  })
  const totalDueStat = useStats('total-due')

  return (
    <Permit roles="teacher,analyst">
      <Box {...props} p={4} borderWidth={1} boxShadow="md">
        <Stack isInline justify="space-between" alignItems="center">
          <Box flexGrow={1}>
            <Heading as="h3" fontSize={5}>
              Transaction Stats for {year}{' '}
              <Text as="span" fontSize={2}>
                (Total {get(totalDueStat.data, 'totalDue', 0) / 100} BDT Due
                from {get(totalDueStat.data, 'totalUsers', 0)} Students){' '}
              </Text>
            </Heading>
          </Box>
          <Box minWidth={150}>
            <InputGroup size="lg">
              <InputLeftElement
                pointerEvents="none"
                children={<FaCalendarAlt />}
              />
              <Input
                ref={yearRef}
                defaultValue={year}
                type="number"
                min="2000"
                max="2099"
                step="1"
              />
              <InputRightElement>
                <IconButton
                  isLoading={loading}
                  icon={FaSyncAlt}
                  onClick={handleYearChange}
                />
              </InputRightElement>
            </InputGroup>
          </Box>
        </Stack>

        <Box height={200}>
          <ResponsiveCalendar
            data={data}
            from={`${year}-01-01`}
            to={`${year}-12-31`}
            minValue="auto"
            colors={[
              '#CC0022',
              '#FF002B',
              '#FF3355',
              '#FF667F',
              '#FF99AA',
              '#FFCCD5',
              '#CCFFCC',
              '#99FF99',
              '#66FF66',
              '#33FF33',
              '#00FF00',
              '#00CC00',
              '#009900',
              '#006600',
            ]}
            emptyColor="#eee"
            margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
            monthBorderColor="#fff"
            dayBorderWidth={2}
            dayBorderColor="#fff"
          />
        </Box>
      </Box>
    </Permit>
  )
}

function PaymentMethod({ ...props }) {
  const userData = useCurrentUserData()

  return (
    <Box {...props} p={4} borderWidth={1} boxShadow="md">
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
      <Stack spacing={8}>
        <PaymentMethod />
        <DailyTransactionsForYearStats />
      </Stack>
  )
}

export default DashIndex
