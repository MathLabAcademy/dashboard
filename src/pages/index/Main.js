import { get } from 'lodash-es'
import { connect } from 'react-redux'
import { ResponsiveCalendar } from '@nivo/calendar'
import React, { useCallback, useRef, useState } from 'react'
import { Box } from 'reflexbox'
import { useStats } from 'hooks/useStats'
import { Card, Input, Button, Header } from 'semantic-ui-react'
import HeaderGrid from 'components/HeaderGrid'

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
  )
}

function DashIndex() {
  return (
    <Box>
      <DailyTransactionsForYearStats />
    </Box>
  )
}

const mapStateToProps = ({ user }) => ({
  userData: get(user, 'data')
})

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(DashIndex)
