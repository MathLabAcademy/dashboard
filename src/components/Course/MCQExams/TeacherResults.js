import { Link } from '@reach/router'
import HeaderGrid from 'components/HeaderGrid'
import Permit from 'components/Permit'
import { get, groupBy, keyBy, map, mapValues } from 'lodash-es'
import React, { useEffect, useMemo, useState } from 'react'
import { connect } from 'react-redux'
import { Text } from 'rebass'
import { Button, Header, Segment } from 'semantic-ui-react'
import api from 'utils/api'
import { emptyArray, emptyObject } from 'utils/defaults'

function MCQExamResult({ mcqExamId }) {
  const [data, setData] = useState(null)

  useEffect(() => {
    api(`/mcqexams/${mcqExamId}/results`).then(({ data }) => {
      setData(data)
    })
  }, [mcqExamId])

  const dataByUserId = useMemo(() => {
    const users = map(
      get(data, 'Trackers', emptyArray).filter((tracker) => tracker.end),
      'User'
    )

    const totalMarks = get(data, 'Questions', emptyArray).length

    const correctOptionIdByQuestionId = mapValues(
      keyBy(get(data, 'Questions', emptyArray), 'id'),
      'Answer.id'
    )

    const submissionsByUserId = mapValues(
      groupBy(get(data, 'Submissions', emptyArray), 'userId'),
      (submissions) => mapValues(keyBy(submissions, 'mcqId'), 'mcqOptionId')
    )

    const dataByUserId = {}

    for (const user of users) {
      const submissions = get(submissionsByUserId, user.id, emptyObject)

      dataByUserId[user.id] = {
        id: get(user, 'id'),
        fullName: get(user, 'Person.fullName'),
        phone: get(user, 'Person.phone'),
        answersSubmitted: `${Object.values(submissions).length}/${totalMarks}`,
        correctlyAnswered: `${
          Object.keys(submissions).filter((questionId) => {
            return (
              submissions[questionId] ===
              correctOptionIdByQuestionId[questionId]
            )
          }).length
        }/${totalMarks}`,
      }
    }

    return dataByUserId
  }, [data])

  return (
    <Permit teacher>
      <Segment>
        <HeaderGrid
          Left={<Header>Result Summary </Header>}
          Right={
            <Button as={Link} to={`..`}>
              Back
            </Button>
          }
        />
      </Segment>
      {Object.entries(dataByUserId).map(([userId, data]) => (
        <Segment key={userId}>
          <Text>
            <strong>User ID: </strong>
            {data.id}
          </Text>
          <Text>
            <strong>Full name: </strong>
            {data.fullName}
          </Text>
          <Text>
            <strong>Phone: </strong>
            {data.phone}
          </Text>
          <br />
          <Text>
            <strong>Answers Submitted: </strong>
            {data.answersSubmitted}
          </Text>
          <Text>
            <strong>Correctly Answered: </strong>
            {data.correctlyAnswered}
          </Text>
        </Segment>
      ))}
    </Permit>
  )
}

const mapStateToProps = null

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(MCQExamResult)
